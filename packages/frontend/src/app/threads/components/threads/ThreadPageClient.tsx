"use client";

import { useState } from "react";
import { ThreadList } from "./ThreadList";
import { CreateThreadForm } from "./CreateThreadForm";
import { ThreadType } from "@b3s/shared/src/types";

type Props = {
    initialThreads: ThreadType.ThreadType[];
};

export default function ThreadPageClient({ initialThreads }: Props) {
    const [threads, setThreads] = useState(initialThreads);

    const handleCreated = (newThread: ThreadType.ThreadType) => {
        setThreads((prev) => [newThread, ...prev]);
    };
    return (
        <div className="px-5">
            <div className="text-3xl font-bold pb-6">スレッド一覧</div>
            <CreateThreadForm onCreated={handleCreated} />
            <ThreadList threads={threads} />
        </div>
    );
}
