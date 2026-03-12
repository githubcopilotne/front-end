interface StatusBadgeProps {
    status: number   // 0 = ẩn, 1 = hiện
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
    if (status === 1) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-600">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Hiện
            </span>
        )
    }

    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-50 text-red-500">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Ẩn
        </span>
    )
}

export default StatusBadge
