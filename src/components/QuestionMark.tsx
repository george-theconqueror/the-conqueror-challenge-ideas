import Image from "next/image"

export default function QuestionMark({ className }: { className?: string }) {
    return (
        <Image 
            src="/circle-question-mark.svg"
            alt="Question Mark"
            width={48}
            height={48}
            className={className}
        />
    );
}