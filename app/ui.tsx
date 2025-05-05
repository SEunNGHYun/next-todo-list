"use client";

import { Button, Input } from "node_modules/@material-tailwind/react";
import Todo from "./components/todo";
import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createTodo, getTodos } from "actions/todo-actions";

export default function UI() {
    const [searchInput, setSearchInput] = React.useState<string>("");

    const todosQuery = useQuery({
        queryKey: ["todos", searchInput],
        queryFn: () => getTodos({ searchInput }),
    });

    const createTodoMutation = useMutation({
        mutationFn: () => {
            return createTodo({
                title: "new todo",
                completed: false,
            });
        },

        onSuccess: () => {
            todosQuery.refetch();
        },
    });

    return (
        <div className="w-2/3 mx-auto flex flex-col items-center py-1 gap-2">
            <h1 className="text-xl font-bold">TODO LIST</h1>
            <Input
                label="search todo"
                placeholder="search todo"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                icon={<i className="fa-solid fa-magnifying-glass"></i>}
            />

            {todosQuery.isLoading && <p>is Loading...</p>}
            {todosQuery.data &&
                todosQuery.data.map((todo) => (
                    <Todo
                        key={"todo item" + todo.id}
                        value={todo.title}
                        completed={todo.completed}
                        id={todo.id}
                    />
                ))}

            <Button
                onClick={() => createTodoMutation.mutate()}
                loading={createTodoMutation.isPending}
            >
                ADD TODO
                <i className="fa-solid fa-add ml-1"></i>
            </Button>
        </div>
    );
}
