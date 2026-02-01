import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

type DirEntries = {
	files: string[];
	dirs: string[];
};

const rootArg = process.argv[2] ?? "docs";
const rootDir = path.resolve(process.cwd(), rootArg);
const outputPath = path.join(rootDir, "_sidebar.md");

function isMarkdown(fileName: string) {
	return fileName.toLowerCase().endsWith(".md");
}

function titleFromFilename(fileName: string) {
	const baseName = fileName.replace(/\.md$/i, "");
	if (!baseName.includes("-") && !baseName.includes("_")) {
		return baseName;
	}
	return baseName
		.split(/[-_]/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function stripQuotes(value: string) {
	const trimmed = value.trim();
	if (
		(trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1);
	}
	return trimmed;
}

function extractFrontmatterTitle(content: string) {
	const lines = content.split(/\r?\n/);
	if (lines[0]?.trim() !== "---") {
		return null;
	}
	let endIndex = -1;
	for (let i = 1; i < lines.length; i += 1) {
		const line = lines[i];
		if (!line) {
			continue;
		}
		if (line.trim() === "---") {
			endIndex = i;
			break;
		}
	}
	if (endIndex === -1) {
		return null;
	}
	for (const line of lines.slice(1, endIndex)) {
		const match = line.match(/^title:\s*(.+)\s*$/);
		if (match) {
			const title = match[1];
			if (title) {
				return stripQuotes(title);
			}
		}
	}
	return null;
}

function titleForFile(filePath: string) {
	const content = readFileSync(filePath, "utf8");
	const frontmatterTitle = extractFrontmatterTitle(content);
	if (frontmatterTitle && frontmatterTitle.length > 0) {
		return frontmatterTitle;
	}
	return titleFromFilename(path.basename(filePath));
}

function toLinkPath(filePath: string) {
	return path.relative(rootDir, filePath).split(path.sep).join("/");
}

function readDirEntries(dirPath: string): DirEntries {
	const entries = readdirSync(dirPath, { withFileTypes: true });
	const files: string[] = [];
	const dirs: string[] = [];
	for (const entry of entries) {
		if (entry.name.startsWith(".")) {
			continue;
		}
		const fullPath = path.join(dirPath, entry.name);
		if (entry.isDirectory()) {
			dirs.push(entry.name);
			continue;
		}
		if (entry.isFile() && isMarkdown(entry.name) && entry.name !== "_sidebar.md") {
			files.push(entry.name);
			continue;
		}
		if (entry.isSymbolicLink() && statSync(fullPath).isDirectory()) {
			dirs.push(entry.name);
		}
	}
	files.sort((a, b) => a.localeCompare(b));
	dirs.sort((a, b) => a.localeCompare(b));
	return { files, dirs };
}

function titleForDir(dirName: string) {
	if (!dirName.includes("-") && !dirName.includes("_")) {
		return dirName.charAt(0).toUpperCase() + dirName.slice(1);
	}
	return titleFromFilename(dirName);
}

function renderDirectory(dirPath: string, indentLevel: number, includeDirs = true) {
	const { files, dirs } = readDirEntries(dirPath);
	const lines: string[] = [];
	const indent = "  ".repeat(indentLevel);
	const readmeIndex = files.findIndex((file) => file.toLowerCase() === "readme.md");
	if (readmeIndex >= 0) {
		const readme = files.splice(readmeIndex, 1)[0];
		if (readme) {
			files.unshift(readme);
		}
	}
	for (const fileName of files) {
		const fullPath = path.join(dirPath, fileName);
		const title = titleForFile(fullPath);
		const link = toLinkPath(fullPath);
		lines.push(`${indent}- [${title}](${link})`);
	}
	if (includeDirs) {
		for (const dirName of dirs) {
			lines.push(`${indent}- ${titleForDir(dirName)}`);
			const childLines = renderDirectory(path.join(dirPath, dirName), indentLevel + 1);
			lines.push(...childLines);
		}
	}
	return lines;
}

function generateSidebar() {
	const { files, dirs } = readDirEntries(rootDir);
	const blocks: string[][] = [];
	if (files.length > 0) {
		blocks.push(renderDirectory(rootDir, 0, false));
	}
	for (const dirName of dirs) {
		const block: string[] = [];
		block.push(`- ${titleForDir(dirName)}`);
		block.push(...renderDirectory(path.join(rootDir, dirName), 1));
		blocks.push(block);
	}
	const content = `${blocks.map((block) => block.join("\n")).join("\n\n")}\n`;
	writeFileSync(outputPath, content, "utf8");
}

generateSidebar();
