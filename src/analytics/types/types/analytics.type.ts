export interface AnalyticsInterface {
  bookmark: {
    id: string;
    title: string;
    totalClick: number;
    todos: {
      todo: number;
      done: number;
    };
    content: {
      total: number;
    };
  }[];
  todos: {
    todo: number;
    done: number;
  };
  content: {
    total: number;
  };
}
