import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface ToDoListProps {
  gameName: string;
}

export default function ToDoList({ gameName }: ToDoListProps) {
  // Funções utilitárias precisam ser declaradas antes do useState
  const getStorageKey = (game: string) =>
    `game-tasks-${game.toLowerCase().replace(/\s+/g, "-")}`;

  const loadStoredTasks = (game: string): Task[] => {
    const storedTasks = localStorage.getItem(getStorageKey(game));
    return storedTasks ? JSON.parse(storedTasks) : [];
  };

  // Agora podemos usar o loadStoredTasks no useState
  const [tasks, setTasks] = useState<Task[]>(() => loadStoredTasks(gameName));
  const [newTask, setNewTask] = useState<string>("");

  // Effects e handlers
  useEffect(() => {
    localStorage.setItem(getStorageKey(gameName), JSON.stringify(tasks));
  }, [tasks, gameName]);

  useEffect(() => {
    setTasks(loadStoredTasks(gameName));
  }, [gameName]);

  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask.trim(),
          completed: false,
        },
      ]);
      setNewTask("");
    }
  };

  const toggleTask = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <form onSubmit={addTask} className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Adicionar nova tarefa..."
            value={newTask}
            onChange={handleInputChange}
            className="flex-1"
          />
          <Button type="submit">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 group"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                type="button"
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <span
                className={`flex-1 ${
                  task.completed ? "line-through text-slate-500" : ""
                }`}
              >
                {task.text}
              </span>
              <Button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 ghost"
                type="button"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
