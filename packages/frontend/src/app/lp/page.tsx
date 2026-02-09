import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./page.module.css";

const navItems = [
	{ id: "top", label: "Top" },
	{ id: "feature", label: "Feature" },
	{ id: "uservoice", label: "User Voice" },
	{ id: "faq", label: "FAQ" },
	{ id: "download", label: "Download" },
];

const stats = [
	{ value: "100K+", label: "Users" },
	{ value: "10K+", label: "Reviews" },
	{ value: "97%", label: "Retention" },
];

const achievementMetrics = [
	{ value: "4.9 stars", label: "App Rating" },
	{ value: "10K+", label: "App Reviews" },
	{ value: "100K+", label: "Users" },
	{ value: "97%", label: "Retention" },
];

const featureBullets = [
	{
		title: "登録不要",
		body: "アプリをダウンロードするだけですぐに利用可能。面倒な登録は不要です。",
	},
	{
		title: "直感的な操作",
		body: "シンプルで使いやすいインターフェースで誰でも操作できます。",
	},
	{
		title: "オフライン対応",
		body: "通信のない旅先でも記録・写真追加が可能で、あとから同期できます。",
	},
];

const featureCards = [
	{
		icon: "C",
		title: "写真を撮る",
		subtitle: "Take a picture",
		body: "このアプリは単なる旅行記録ツールではありません。あなたの冒険の物語を紡ぎ出す、デジタル時代の万華鏡です。",
	},
	{
		icon: "H",
		title: "気持ちを添える",
		subtitle: "Add your feelings",
		body: "写真やスポットに、その時の感動や思いをテキストで追加できます。気分を表す絵文字やタグを付けることで、後から振り返る際に鮮明に当時の感情を思い出せます。",
	},
	{
		icon: "S",
		title: "シェアする",
		subtitle: "Share your journey",
		body: "記録した旅の思い出は、美しいレイアウトアルバムや動画などに加工して自動編集されます。プライバシー設定も細かく調整でき、共有したい情報だけを選んで公開できます。",
	},
];

const testimonials = [
	{
		title: "旅の記憶が鮮やかによみがえる",
		text: "私の人生を変えたアプリです。世界一周の思い出をTRAVEL TRACKERで記録しました。写真、メモ、位置情報が整理され、共有も簡単。旅好きにおすすめです。",
		role: "ソフィア・ランバート / 写真家",
	},
	{
		title: "時間旅行のような閲覧体験",
		text: "準備から記録まで全て楽になりました。ピン留め、予算管理、リアルタイム記録。過去を振り返るのがまるで時間旅行。",
		role: "フェリックス・ドゥランテ / バックパッカー",
	},
];

const faqItems = [
	{
		question: "TRAVEL TRACKERは無料で使えますか？",
		answer:
			"基本機能は無料です。プレミアムな拡張機能や追加ストレージは有料となります。",
	},
	{
		question: "オフラインでも使用できますか？",
		answer:
			"主要機能はネット接続なしで動作。記録や写真の追加は可能ですが、クラウド同期には接続が必要です。",
	},
	{
		question: "過去の旅行データをインポートできますか？",
		answer: "CSVやGPXのインポートに対応。EXIFを使った軌跡再現も可能です。",
	},
	{
		question: "プライバシーは守られますか？",
		answer:
			"記録は暗号化され、共有はユーザーが明示的に選択した範囲のみ公開されます。",
	},
];

const getDelayStyle = (step: number): CSSProperties => ({
	animationDelay: `${step * 0.18}s`,
});

export default function LpPage() {
	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<div className={styles.headerInner}>
					<div className={styles.brand}>
						<span className={styles.brandDot} />
						<span className={styles.brandText}>TRAVEL TRACKER</span>
					</div>
					<nav className={styles.nav}>
						{navItems.map((item) => (
							<a key={item.id} href={`#${item.id}`}>
								{item.label}
							</a>
						))}
					</nav>
					<div className={styles.headerActions}>
						<button type="button" className={styles.downloadTopButton}>
							Download
						</button>
						<button type="button" className={styles.menuButton}>
							MENU
						</button>
					</div>
				</div>
			</header>

			<main className={styles.main}>
				<section
					className={`${styles.hero} ${styles.animateBlock}`}
					style={getDelayStyle(0)}
				>
					<div className={styles.heroContent}>
						<p className={styles.heroBadge}>Travel diary</p>
						<h1 className={styles.heroHeadline}>
							One Adventure
							<br />
							at a Time
						</h1>
						<p className={styles.heroLead}>
							一瞬を切り取る、バックパッカーのためのアプリ
						</p>
						<div className={styles.heroStats}>
							{stats.map((stat) => (
								<div key={stat.label} className={styles.heroMetric}>
									<span className={styles.heroMetricValue}>{stat.value}</span>
									<span className={styles.heroMetricLabel}>{stat.label}</span>
								</div>
							))}
						</div>
						<div className={styles.heroActions}>
							<a className={styles.primaryCta} href="#download">
								無料ではじめる
							</a>
							<a className={styles.secondaryCta} href="#download">
								Download for iOS / Android
							</a>
						</div>
					</div>
					<div className={styles.heroVisual}>
						<div className={styles.heroGradient} />
						<div className={styles.heroPhone}>
							<Image
								src="/lp/hero-app.png"
								alt="App preview"
								fill
								className={styles.heroPhoneImage}
							/>
						</div>
					</div>
				</section>

				<section
					id="top"
					className={`${styles.section} ${styles.aboutSection} ${styles.animateBlock}`}
					style={getDelayStyle(1)}
				>
					<div className={styles.sectionTitle}>
						<p className={styles.sectionSubtitle}>What's travel tracker</p>
						<h2>トラベルトラッカーとは</h2>
					</div>
					<p className={styles.aboutBody}>
						旅の思い出は、時として私たちの人生を変える力を持っています。その瞬間、その感動、そして心の動きを
						永遠に残したい。TRAVEL
						TRACKERは、そんな旅人の想いに応えるために生まれました。旅の章を開き、あなたと共に世界を旅します。
					</p>
					<div className={styles.downloadButtons}>
						<a className={styles.downloadButton} href="#download">
							Download for iOS
						</a>
						<a className={styles.downloadButton} href="#download">
							Download for Android
						</a>
					</div>
					<div className={styles.gallery}>
						{["/lp/cta-bg.jpg", "/lp/feature-detail.jpg"].map((src) => (
							<div key={src} className={styles.galleryItem}>
								<Image
									src={src}
									alt="旅先"
									fill
									className={styles.galleryImage}
								/>
							</div>
						))}
					</div>
				</section>

				<section
					id="feature"
					className={`${styles.section} ${styles.featureSection} ${styles.animateBlock}`}
					style={getDelayStyle(2)}
				>
					<div className={styles.sectionTitle}>
						<p className={styles.sectionSubtitle}>Feature</p>
						<h2>特徴・機能</h2>
					</div>
					<div className={styles.featureHero}>
						<div className={styles.featureHeroText}>
							<h3>
								アプリダウンロードで
								<br />
								すぐに始められる
							</h3>
							<p>Just download the app to get started</p>
							<ul className={styles.featureList}>
								{featureBullets.map((item) => (
									<li key={item.title} className={styles.featureListItem}>
										<strong>{item.title}</strong>
										<p>{item.body}</p>
									</li>
								))}
							</ul>
						</div>
						<div className={styles.featureHeroVisual}>
							<div className={styles.featureHeroFrame}>
								<Image
									src="/lp/hero-app.png"
									alt="Feature"
									fill
									className={styles.heroPhoneImage}
								/>
							</div>
						</div>
					</div>
					<div className={styles.featureGrid}>
						{featureCards.map((card) => (
							<div key={card.title} className={styles.featureCard}>
								<div className={styles.featureCardHead}>
									<span className={styles.featureCardIcon}>{card.icon}</span>
									<div className={styles.featureCardText}>
										<h4>{card.title}</h4>
										<p className={styles.featureCardSubTitle}>
											{card.subtitle}
										</p>
										<p>{card.body}</p>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className={styles.metrics}>
						{achievementMetrics.map((item) => (
							<div key={item.label} className={styles.metricTile}>
								<span className={styles.metricValue}>{item.value}</span>
								<span className={styles.metricLabel}>{item.label}</span>
							</div>
						))}
					</div>
				</section>

				<section
					id="uservoice"
					className={`${styles.section} ${styles.voiceSection} ${styles.animateBlock}`}
					style={getDelayStyle(3)}
				>
					<div className={styles.sectionTitle}>
						<p className={styles.sectionSubtitle}>User’s Voice</p>
						<h2>ユーザーの声</h2>
					</div>
					<div className={styles.voiceGrid}>
						{testimonials.map((item) => (
							<div key={item.title} className={styles.voiceCard}>
								<h3 className={styles.voiceCardTitle}>{item.title}</h3>
								<p className={styles.voiceCardText}>{item.text}</p>
								<div className={styles.voiceMeta}>{item.role}</div>
							</div>
						))}
					</div>
				</section>

				<section
					id="faq"
					className={`${styles.section} ${styles.faqSection} ${styles.animateBlock}`}
					style={getDelayStyle(4)}
				>
					<div className={styles.sectionTitle}>
						<p className={styles.sectionSubtitle}>FAQ</p>
						<h2>よくある質問</h2>
					</div>
					<div className={styles.faqList}>
						{faqItems.map((item) => (
							<div key={item.question} className={styles.faqItem}>
								<p className={styles.faqQuestion}>{item.question}</p>
								<p className={styles.faqAnswer}>{item.answer}</p>
							</div>
						))}
					</div>
				</section>

				<section
					id="download"
					className={`${styles.ctaSection} ${styles.animateBlock}`}
					style={getDelayStyle(5)}
				>
					<div className={styles.ctaContent}>
						<h2 className={styles.ctaTitle}>
							今すぐダウンロードして旅を楽しもう
						</h2>
						<p className={styles.ctaCopy}>
							Just download the app to get started
						</p>
						<div className={styles.ctaButtons}>
							<a href="#download" className={styles.downloadButton}>
								Download for iOS
							</a>
							<a href="#download" className={styles.downloadButton}>
								Download for Android
							</a>
						</div>
					</div>
				</section>
			</main>

			<footer className={styles.footer}>
				<div className={styles.footerInner}>
					<div className={styles.footerBrand}>TRAVEL TRACKER</div>
					<ul className={styles.footerLinks}>
						<li>
							<a className={styles.footerLink} href="/about">
								About
							</a>
						</li>
						<li>
							<a className={styles.footerLink} href="#feature">
								Feature
							</a>
						</li>
						<li>
							<a className={styles.footerLink} href="#faq">
								FAQ
							</a>
						</li>
						<li>
							<a className={styles.footerLink} href="#download">
								Download
							</a>
						</li>
					</ul>
					<p>(C)2026 TRAVEL TRACKER.</p>
				</div>
			</footer>
		</div>
	);
}
