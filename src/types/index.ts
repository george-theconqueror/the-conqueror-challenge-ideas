export interface Title {
  id: number;
  title: string;
  elo: number;
  appearances: number;
}

export interface RandomTitlesResponse {
  titles: Title[];
  count: number;
}
