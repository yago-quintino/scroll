import { useEffect } from "react";
import { useRef } from "react";
import { useInfiniteQuery } from "react-query";
import Character from "./Character";

export default function CharactersScroll() {
  const scrollObserverRef = useRef();

  const { data, isLoading, isError, error, hasNextPage, fetchNextPage } =
    useInfiniteQuery(
      "characters",
      ({ pageParam = 1 }) => fetchCharacters(pageParam),
      {
        getNextPageParam: (lastPage, pages) => {
          if (pages.length < lastPage.info.pages) {
            return pages.length + 1;
          } else {
            return undefined;
          }
        },
      }
    );

  function handleScrollObserver(entries) {
    const [scrollEntry] = entries;
    if (scrollEntry.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(handleScrollObserver);

    if (scrollObserverRef.current) observer.observe(scrollObserverRef.current);

    return () => {
      if (scrollObserverRef.current) {
        return observer.disconnect(scrollObserverRef.current);
      }
    };
  }, [scrollObserverRef]);

  async function fetchCharacters(pageParam) {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character?page=${pageParam}`
    );
    const data = await response.json();
    return data;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>{error}...</div>;
  }

  return (
    <div>
      <div className="characters">
        {data.pages.map((charactersGroup) => {
          return charactersGroup.results.map((character) => {
            return <Character key={character.id} character={character} />;
          });
        })}
      </div>
      <div id="scroll" ref={scrollObserverRef}></div>
    </div>
  );
}
