export interface Squad {
  count: number;
  name: string;
}

export interface SquadSuggestion {
  name: string;
  count: number;
  countering: {
    count: number;
    counterPriority: number;
    name: string;
  };
}
