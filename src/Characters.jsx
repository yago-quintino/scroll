import React, { useState } from "react";
import { useQuery } from "react-query";
import Character from "./Character";

export default function Characters() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isPreviousData, status } = useQuery(
    ["characters", page],
    fetchCharacters,
    {
      keepPreviousData: true,
    }
  );

  async function fetchCharacters({ queryKey }) {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character?page=${queryKey[1]}`
    );
    const data = await response.json();
    return data;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div className="characters">
      {data?.results?.map((character) => {
        return <Character key={character.id} character={character} />;
      })}
      <div>
        <button
          disabled={isPreviousData || !data.info.prev}
          onClick={(_) => setPage((p) => p - 1)}
        >
          Previous
        </button>
        <button
          disabled={isPreviousData || !data.info.next}
          onClick={(_) => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
