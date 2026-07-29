import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className }) => (
    <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`} />
);

export const DashboardSkeleton = () => (
    <div className="max-w-7xl mx-auto pt-28 px-6 pb-20 space-y-12">
        <div className="flex justify-between items-end">
            <div className="space-y-3">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-6 w-48" />
            </div>
            <div className="flex gap-4">
                <Skeleton className="h-12 w-32 rounded-full" />
                <Skeleton className="h-12 w-12 rounded-2xl" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-[2.5rem]" />
            <Skeleton className="h-32 rounded-[2.5rem]" />
            <Skeleton className="h-32 rounded-[2.5rem]" />
        </div>

        <div className="bg-white rounded-[4rem] h-[600px] shadow-sm animate-pulse" />
    </div>
);

export const LessonSkeleton = () => (
    <div className="max-w-6xl mx-auto pt-24 px-4 space-y-8">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-64 rounded-[3rem]" />
                <Skeleton className="h-96 rounded-[3rem]" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-48 rounded-[2.5rem]" />
                <Skeleton className="h-48 rounded-[2.5rem]" />
            </div>
        </div>
    </div>
);

export default Skeleton;
