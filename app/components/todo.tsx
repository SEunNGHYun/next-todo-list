'use client";';

import { IconButton, Checkbox, Input } from "@material-tailwind/react";
import { deleteTodo, updateTodo } from "actions/todo-actions";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { queryClient } from "app/config/ReactQueryClientProvirer";
import { title } from "process";

export default function Todo({
    id,
    completed,
    value,
}: {
    id: number;
    completed: boolean;
    value: string;
}) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [isCompleted, setIsCompleted] = React.useState(completed);
    const [editingValue, setEditingValue] = React.useState(value);

    const updateMutation = useMutation({
        mutationFn: () =>
            updateTodo({
                id: id,
                title: editingValue,
                completed: isCompleted,
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todos"],
            });
            setIsEditing(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () =>
            deleteTodo({
                id: id,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todos"],
            });
        },
    });

    return (
        <div className="flex w-full items-center gap-1">
            <Checkbox
                checked={isCompleted}
                onChange={async (e) => {
                    await setIsCompleted(e.target.checked);
                    await updateMutation.mutate();
                }}
            />

            {isEditing ? (
                <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="flex-1 border-b-2 border-gray-300 focus:outline-none"
                />
            ) : (
                <p className={`flex-1 ${isCompleted && "line-through"}`}>
                    {value}
                </p>
            )}

            {isEditing ? (
                <IconButton
                    onClick={async () => {
                        await updateMutation.mutate();
                    }}
                >
                    {updateMutation.isPending && <p>...</p>}
                    <i className="fa-solid fa-check"></i>
                </IconButton>
            ) : (
                <IconButton onClick={() => setIsEditing(true)}>
                    <i className="fa-solid fa-pen"></i>
                </IconButton>
            )}

            <IconButton
                onClick={async () => {
                    await deleteMutation.mutate();
                }}
            >
                {deleteMutation.isPending && <p>...</p>}
                <i className="fa-solid fa-trash"></i>
            </IconButton>
        </div>
    );
}
