import { useState } from "react";
import Layout from "../components/Layout";

interface Word {
  word: string;
  freq: number;
  nsyl: number;
}

const PROD_URL = "https://rimer.herokuapp.com";
const DEV_URL = "http://localhost:8000";

const sortByNsyl = (data: Word[]) => {
  let result: Record<number, Word[]> = {};
  for (const i of data) {
    const k = i.nsyl.toString();
    if (!Object.keys(result).includes(k)) {
      result[k] = [];
    }
    result[k].push(i);
  }
  return result;
};

const calcOpacity = (freq: number) => {
  if (freq >= 100) {
    return "bg-opacity-100";
  } else if (freq >= 1) {
    return "bg-opacity-80";
  } else if (freq >= 0.01) {
    return "bg-opacity-60";
  } else if (freq > 0) {
    return "bg-opacity-40";
  } else {
    return "bg-opacity-25";
  }
};

const cRhyme = async (
  word: string,
  freq: number,
  nsyl: number,
  yeismo: boolean,
  seseo: boolean,
  eqbv: boolean
) => {
  const res = await fetch(
    `${PROD_URL}/api/c/${word}?freq=${freq}&nsyl=${nsyl}&yeismo=${yeismo}&seseo=${seseo}&bv=${eqbv}`
  );
  const data = await res.json();
  return sortByNsyl(data.contents);
};

const aRhyme = async (word: string, freq: number, nsyl: number) => {
  const res = await fetch(
    `${PROD_URL}/api/a/${word}?freq=${freq}&nsyl=${nsyl}`
  );
  const data = await res.json();
  return sortByNsyl(data.contents);
};

const IndexPage = () => {
  const [word, setWord] = useState("");
  const [freq, setFreq] = useState(0);
  const [nsyl, setNsyl] = useState(0);
  const [kind, setKind] = useState<"a" | "c">("c");
  const [seseo, setSeseo] = useState(false);
  const [yeismo, setYeismo] = useState(true);
  const [eqbv, seteqBv] = useState(true);
  const [words, setWords] = useState<Record<number, Word[]>>({});

  const fetchWords = async (e) => {
    e.preventDefault();
    const data = await (kind === "c"
      ? cRhyme(word, freq, nsyl, yeismo, seseo, eqbv)
      : aRhyme(word, freq, nsyl));
    setWords(data);
  };

  const freq_keys = Object.keys(words);
  freq_keys.sort();

  return (
    <Layout title="Home | Rymador">
      <h1 className="text-2xl text-center m-4">Rymador - Search for rhyming words in Spanish</h1>
      <div className="">
        <form onSubmit={fetchWords}>
          <div className="flex border-grey-light border">
            <input
              className="w-full rounded pl-1.5"
              type="search"
              onChange={(e) => setWord(e.target.value)}
              value={word}
            />
            <input
              type="submit"
              value="Search"
              className="bg-grey-lightest border-grey border-l shadow hover:bg-grey-lightest"
            />
          </div>
          <div className="mt-2">
            <label className="inline-flex items-center">
              {"Frequency"}
              <select
                className="ml-2"
                onChange={(e) => setFreq(Number(e.target.value))}
                defaultValue={freq}
              >
                <option value="0">All</option>
                {[1, 2, 3, 4, 5].map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-flex items-center ml-6">
              {"No. of Syllables"}
              <select
                className="ml-2"
                onChange={(e) => setNsyl(Number(e.target.value))}
                defaultValue={nsyl}
              >
                <option value="0">All</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex">
            <span className="mt-2 mr-6">Rhyme type:</span>
            <div className="mt-2">
              <label htmlFor="c" className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  id="c"
                  name="rhyme"
                  value="c"
                  defaultChecked={kind == "c"}
                  onClick={() => setKind("c")}
                />
                <span className="ml-2">consonant</span>
              </label>
              <label htmlFor="a" className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  className="form-radio"
                  id="a"
                  name="rhyme"
                  value="a"
                  defaultChecked={kind == "a"}
                  onClick={() => setKind("a")}
                />
                <span className="ml-2">assonant</span>
              </label>
            </div>
          </div>
          {kind == "c" && (
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={seseo}
                  onChange={(e) => setSeseo(e.target.checked)}
                />
                <span className="ml-2">{"seseo"}</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="checkbox"
                  defaultChecked={yeismo}
                  onChange={(e) => setYeismo(e.target.checked)}
                />
                <span className="ml-2">{"yeismo"}</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="checkbox"
                  defaultChecked={eqbv}
                  onChange={(e) => seteqBv(e.target.checked)}
                />
                <span className="ml-2">{"b = v"}</span>
              </label>
            </div>
          )}
        </form>
        {freq_keys.length > 0 && <hr className="mt-6 mb-6" />}
        {freq_keys.map((k) => {
          return (
            <div key={k}>
              <h4 className="h4">
                {k} Syllable{Number(k) > 1 && "s"}:
              </h4>
              <ul className="flex flex-wrap">
                {words[k].map((w) => (
                  <li
                    key={w.word}
                    className={`m-1 p-1 bg-purple-600 ${calcOpacity(
                      w.freq
                    )} text-white`}
                  >
                    <a href={`https://dle.rae.es/${w.word}`}>{w.word}</a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default IndexPage;
