"use client";

import { useState, useEffect } from "react";
import { PostList } from "./PostList";
import { CreatePostForm } from "./CreatePostForm";
import { ThreadType } from "@kotobad/shared/src/types";
import { PostListType } from "@kotobad/shared/src/types/post";
import { getPostByThreadId } from "@/lib/api/posts";
import BreadCrumb from "./BreadCrumbs";
import BottomArrowIcon from "@/assets/threads/bottom_arrow.svg";

type Props = {
    thread: ThreadType.ThreadType;
    initialPosts: PostListType;
};

export default function ThreadDetailClient({ thread, initialPosts }: Props) {
    const [posts, setPosts] = useState<PostListType>(
        [...initialPosts].sort(
            (a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
    );

    const refreshPosts = async () => {
        const latestPosts = await getPostByThreadId(thread.id);

        // エラー判定
        if ("error" in latestPosts) {
            console.error(latestPosts.error);
            return;
        }
        setPosts(
            [...latestPosts].sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            ),
        );
    };

    const [showScrollBotton, setShowScrollBotton] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const scrolledToBottom =
                window.innerHeight + window.scrollY >= document.body.scrollHeight - 20;
            setShowScrollBotton(!scrolledToBottom);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    });

    return (
        <div>
            <div className="pl-3">
                <BreadCrumb currentThreadTitle={thread.title} />
            </div>
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col w-full items-center p-4 sm:py-7">
                    <div className="text-xl sm:text-3xl font-bold break-words">
                        {thread.title}
                    </div>
                    <p className="text-gray-400">
                        {new Date(thread.createdAt).toLocaleString()}
                    </p>
                </div>
                <div className="w-full sm:w-1/2">
                    <PostList posts={posts} />
                </div>
            </div>
            <div
                className={`fixed sm:bottom-10 sm:right-10 bottom-3 right-3 transition-opacity duration-100
                ${showScrollBotton ? "opacity-100" : " opacity-0 pointer-events-none"}
                `}
            >
                <button
                    onClick={() =>
                        window.scrollTo({
                            top: document.body.scrollHeight,
                            behavior: "smooth",
                        })
                    }
                >
                    <BottomArrowIcon className="text-gray-600 w-20 h-20 p-4 cursor-pointer" />
                </button>
            </div>
            <div className="flex justify-center">
                <CreatePostForm threadId={thread.id} onSuccess={refreshPosts} />
            </div>
        </div>
    );
}
