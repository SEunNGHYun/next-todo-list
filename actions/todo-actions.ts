"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "app/utils/supabase/server";

export type TODO_ROW = Database["public"]["Tables"]["todo"]["Row"];
export type TODO_ROW_INSERT = Database["public"]["Tables"]["todo"]["Insert"];
export type TODO_ROW_UPDATE = Database["public"]["Tables"]["todo"]["Update"];

function handleError(err) {
    console.log(err);

    throw new Error(err);
}

export async function getTodos({ searchInput = "" }) {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from("todo")
        .select("*")
        .like("title", `%${searchInput}%`)
        .order("created_at", { ascending: true });

    if (error) handleError(error);

    return data;
}

export async function createTodo(todo: TODO_ROW_INSERT) {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from("todo")
        .insert({ ...todo, created_at: new Date().toISOString() });

    if (error) handleError(error);

    return data;
}

export async function updateTodo(todo: TODO_ROW_UPDATE) {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from("todo")
        .update({ ...todo, updated_at: new Date().toISOString() })
        .eq("id", todo.id);

    if (error) handleError(error);

    return data;
}

export async function deleteTodo(todo: { id: number }) {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from("todo")
        .delete()
        .eq("id", todo.id);

    if (error) handleError(error);

    return data;
}
