export interface Question {
  pair_id: string;
  idea1: string;
  idea2: string;
  votes_idea1: number;
  votes_idea2: number;
}

export const questions: Question[] = [
  {
    pair_id: "1",
    idea1: "be able to fly",
    idea2: "be able to breathe underwater",
    votes_idea1: 187,
    votes_idea2: 234
  },
  {
    pair_id: "2",
    idea1: "travel to the past",
    idea2: "travel to the future",
    votes_idea1: 156,
    votes_idea2: 289
  },
  {
    pair_id: "3",
    idea1: "be invisible",
    idea2: "be able to read minds",
    votes_idea1: 245,
    votes_idea2: 178
  },
  {
    pair_id: "4",
    idea1: "have unlimited money",
    idea2: "have unlimited knowledge",
    votes_idea1: 267,
    votes_idea2: 145
  },
  {
    pair_id: "5",
    idea1: "live in a mansion alone",
    idea2: "live in a small apartment with friends",
    votes_idea1: 134,
    votes_idea2: 298
  },
  {
    pair_id: "6",
    idea1: "never need to sleep",
    idea2: "never need to eat",
    votes_idea1: 223,
    votes_idea2: 167
  },
  {
    pair_id: "7",
    idea1: "be famous for something good",
    idea2: "be rich but unknown",
    votes_idea1: 189,
    votes_idea2: 256
  },
  {
    pair_id: "8",
    idea1: "speak all languages",
    idea2: "play all instruments",
    votes_idea1: 278,
    votes_idea2: 123
  },
  {
    pair_id: "9",
    idea1: "be able to teleport anywhere",
    idea2: "be able to time travel",
    votes_idea1: 145,
    votes_idea2: 267
  },
  {
    pair_id: "10",
    idea1: "have a photographic memory",
    idea2: "be able to learn any skill instantly",
    votes_idea1: 234,
    votes_idea2: 178
  },
  {
    pair_id: "11",
    idea1: "live in a world with no technology",
    idea2: "live in a world with only technology",
    votes_idea1: 167,
    votes_idea2: 245
  },
  {
    pair_id: "12",
    idea1: "be the smartest person alive",
    idea2: "be the most attractive person alive",
    votes_idea1: 256,
    votes_idea2: 189
  },
  {
    pair_id: "13",
    idea1: "have a personal chef",
    idea2: "have a personal driver",
    votes_idea1: 198,
    votes_idea2: 234
  },
  {
    pair_id: "14",
    idea1: "be able to control fire",
    idea2: "be able to control water",
    votes_idea1: 223,
    votes_idea2: 167
  },
  {
    pair_id: "15",
    idea1: "know the date of your death",
    idea2: "know the cause of your death",
    votes_idea1: 145,
    votes_idea2: 267
  },
  {
    pair_id: "16",
    idea1: "be able to talk to animals",
    idea2: "be able to talk to plants",
    votes_idea1: 289,
    votes_idea2: 156
  },
  {
    pair_id: "17",
    idea1: "have unlimited creativity",
    idea2: "have unlimited logic",
    votes_idea1: 178,
    votes_idea2: 245
  },
  {
    pair_id: "18",
    idea1: "be able to see in the dark",
    idea2: "be able to see through walls",
    votes_idea1: 234,
    votes_idea2: 189
  },
  {
    pair_id: "19",
    idea1: "have a pet dragon",
    idea2: "have a pet unicorn",
    votes_idea1: 267,
    votes_idea2: 145
  },
  {
    pair_id: "20",
    idea1: "be able to change your appearance at will",
    idea2: "be able to change your voice at will",
    votes_idea1: 198,
    votes_idea2: 223
  }
];

// Helper function to get random questions
export const getRandomQuestions = (count: number): Question[] => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to update selection count
export const updateSelection = (pairId: string, option: 'A' | 'B'): Question[] => {
  return questions.map(q => {
    if (q.pair_id === pairId) {
      if (option === 'A') {
        return { ...q, votes_idea1: q.votes_idea1 + 1 };
      } else {
        return { ...q, votes_idea2: q.votes_idea2 + 1 };
      }
    }
    return q;
  });
};
