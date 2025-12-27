import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  toggleTodoDone,
  fetchTodoForGameFromDatabase,
  saveTodoForGameOnDatabase,
  deleteTodoFromDatabase,
} from "@/app/gameService";

interface Task {
  id: number;
  task: string;
  isCompleted: boolean;
}

interface ToDoListProps {
  gameId: number | undefined;
}

export default function ToDoList({ gameId }: ToDoListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  useEffect(() => {
    if (!gameId) return;
    fetchTodoForGameFromDatabase(gameId).then((result) => {
        if(result.success && result.data) {
             setTasks(result.data as any); 
             // Note: result.data type from supabase might be inferred loosely, 
             // but we expect it to match our table which has bigint id. 
             // in JS runtime it fits in number usually.
        }
    });
  }, [gameId]);

  const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!gameId || !newTask.trim()) return;

    await saveTodoForGameOnDatabase(gameId, newTask.trim());
    const result = await fetchTodoForGameFromDatabase(gameId);
    if(result.success && result.data) setTasks(result.data as any);
    setNewTask("");
  };

  const toggleTask = async (taskId: number, isCompleted: boolean) => {
    await toggleTodoDone(taskId, !isCompleted);
    if (gameId) {
        const result = await fetchTodoForGameFromDatabase(gameId);
        if(result.success && result.data) setTasks(result.data as any);
    }
  };

  const deleteTask = async (taskId: number) => {
    await deleteTodoFromDatabase(taskId);
    if (gameId) {
        const result = await fetchTodoForGameFromDatabase(gameId);
        if(result.success && result.data) setTasks(result.data as any);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  return (
    <div className="w-full">
      <div className="p-0">
        <form onSubmit={addTask} className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Adicionar nova tarefa..."
            value={newTask}
            onChange={handleInputChange}
            className="flex-1"
          />
          <Button type="submit" className="cursor-pointer">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 group"
            >
              <button
                onClick={() => toggleTask(task.id, task.isCompleted)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                type="button"
              >
                {task.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 cursor-pointer" />
                ) : (
                  <Circle className="h-5 w-5 cursor-pointer" />
                )}
              </button>
              <span
                className={`flex-1 ${
                  task.isCompleted ? "line-through text-slate-500" : "text-neutral-700 dark:text-neutral-200"
                }`}
              >
                {task.task}
              </span>
              <Button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 ghost h-8 w-8 p-0 cursor-pointer hover:bg-red-500/10"
                variant="ghost"
                type="button"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
