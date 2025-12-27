import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { GameData } from "./types";

const supabase = createClientComponentClient();

export async function saveGameInDatabase(
  game: GameData,
  status: "playing" | "wishlist",
  platform?: string
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("Usuário não autenticado.");
      return { success: false, error: "Usuário não autenticado." };
    }

    const { error } = await supabase.from("games").insert({
      rawg_id: game.id,
      name: game.name,
      cover_url: game.cover_url,
      status: status,
      platform: platform,
      user_id: user.id,
    });

    if (error) {
      console.log("Erro do SUPABASE ao adicionar o jogo: ", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (exception) {
    console.log(
      "Erro ao tentar adicionar o jogo no banco de dados: ",
      exception
    );
    return { success: false, error: "Ocorreu uma exceção." };
  }
}

export async function fetchGamesListFromDatabase() {
  try {
    const { data, error } = await supabase.from("games").select("*");
    if (error) {
      console.log(
        "Houve um erro ao fazer o fetch dos jogos do banco de dados."
      );
      return { success: false, error: error.message };
    } else {
      return { success: true, data };
    }
  } catch (exception) {
    console.log("Erro ao tentar buscar jogos no banco de dados.", exception);
    return { success: false, error: "Ocorreu uma exceção." };
  }
}

export async function deleteGameFromDatabase(id: number) {
  try {
    const { error } = await supabase.from("games").delete().eq("id", id);

    if (error) {
      console.log("Erro do SUPABASE ao deletar o jogo: ", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (exception) {
    console.log("Erro ao tentar deletar o jogo do banco de dados: ", exception);
    return { success: false, error: "Ocorreu uma exceção." };
  }
}

export async function saveTodoForGameOnDatabase(id: number, task: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("Usuário não autenticado.");
      return { success: false, error: "Usuário não autenticado." };
    }

    const { data, error } = await supabase
      .from("todos")
      .insert({ game_id: id, task, isCompleted: false, user_id: user.id })
      .select();
    if (error) {
      console.log("Erro do supabase ao salvar o item todo.", error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (exception) {
    console.log(
      "Houve uma exceção ao tentar salvar o todo no banco de dados: ",
      exception
    );
    return { success: false, error: "Ocorreu uma exceção." };
  }
}

export async function fetchTodoForGameFromDatabase(id: number) {
  try {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("game_id", id)
      .order("created_at", { ascending: true });
    if (error) {
      console.log("Erro do supabase ao fazer o fetch do item todo.", error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (exception) {
    console.log(
      "Houve uma exceção ao tentar resgatar o todo do banco de dados: ",
      exception
    );
    return { success: false, error: "Ocorreu uma exceção." };
  }
}

export async function toggleTodoDone(todoId: number, isCompleted: boolean) {
  try {
    const { data, error } = await supabase
      .from("todos")
      .update({ isCompleted })
      .eq("id", todoId)
      .select();
    if (error) {
      console.log("Erro do supabase ao marcar o item todo como feito.", error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (exception) {
    console.log(
      "Houve uma exceção ao tentar alterar o estado do item todo no banco de dados: ",
      exception
    );
    return { success: false, error: "Ocorreu uma exceção." };
  }
}

export async function deleteTodoFromDatabase(todoId: number) {
  try {
    const { data, error } = await supabase
      .from("todos")
      .delete()
      .eq("id", todoId)
      .select();
    if (error) {
      console.log("Erro do supabase ao deletar o item todo.", error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (exception) {
    console.log(
      "Houve uma exceção ao tentar deletar o item todo do banco de dados: ",
      exception
    );
    return { success: false, error: "Ocorreu uma exceção." };
  }
}

export async function updateGameStatus(
  id: number,
  status: "playing" | "wishlist"
) {
  try {
    const { error } = await supabase
      .from("games")
      .update({ status })
      .eq("id", id);
    if (error) {
      console.log("Erro do SUPABASE ao atualizar o status do jogo: ", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (exception) {
    console.log(
      "Erro ao tentar atualizar o status do jogo no banco de dados: ",
      exception
    );
    return { success: false, error: "Ocorreu uma exceção." };
  }
}
