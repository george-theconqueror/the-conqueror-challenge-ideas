export interface Title {
  id: number;
  title: string;
  elo: number;
  appearances: number;
  added_favorite: number;
}

export interface RandomTitlesResponse {
  titles: Title[];
  count: number;
}
