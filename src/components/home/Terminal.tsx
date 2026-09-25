import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useRouter } from '../../lib/router';
import { GAMES, getGame } from '../../data/games';
import { CONTACT_LINKS } from '../../data/site';
import { paths } from '../../lib/paths';
import { ACHIEVEMENTS, unlock, useUnlocked } from '../../lib/achievements';
import { toggleZombieMode, zombieStore, makeItRainFish } from '../../lib/easterEggs';
import './terminal.css';

interface Line {
  kind: 'in' | 'out' | 'sys';
  text: string;
}

const PROMPT = 'byte@zombyte:~$';
const COMMANDS = ['help', 'whoami', 'games', 'open', 'stack', 'contact', 'secrets', 'zombie', 'fish', 'clear', 'echo', 'date', 'sudo', 'exit'];

const INITIAL: Line[] = [
  { kind: 'in', text: 'whoami' },
  { kind: 'out', text: 'Software Engineer → AI Engineer → making games.' },
  { kind: 'sys', text: 'Type "help" and press Enter.' },
];

/** A tiny fake shell. Try `help`. */
export function Terminal() {
  const { navigate } = useRouter();
  const unlocked = useUnlocked();
  const [lines, setLines] = useState<Line[]>(INITIAL);
  const [value, setValue] = useState('');
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [lines]);

  const run = (raw: string) => {
    const input = raw.trim();
    const [name = '', ...args] = input.split(/\s+/);
    const out: Line[] = [{ kind: 'in', text: input }];
    const say = (...text: string[]) => text.forEach((t) => out.push({ kind: 'out', text: t }));

    switch (name.toLowerCase()) {
      case '':
        break;
      case 'help':
        say(
          'whoami        who is behind all this',
          'games         list the games',
          'open <game>   jump to a game',
          'stack         tools of the trade',
          'contact       how to reach me',
          'secrets       secrets found so far',
          'fish          cast a line',
          'zombie        …you will see',
          'clear         clear the screen',
        );
        break;
      case 'whoami':
        say('Daniel Monge. AI Engineer from Costa Rica.', 'Software Engineer graduate, solo developer behind Zombyte Games.');
        break;
      case 'ls':
      case 'games':
        say(...GAMES.map((g) => `${g.slug.padEnd(16, ' ')}[${g.statusLabel.toUpperCase()}]`), 'Try: open bloodcast');
        break;
      case 'cd':
      case 'open':
      case 'play': {
        const slug = (args[0] ?? '').replace(/^games\//, '').replace(/\/$/, '').toLowerCase();
        const game = getGame(slug);
        if (game) {
          say(`Jumping to ${game.title}…`);
          window.setTimeout(() => navigate(paths.game(game.slug)), 500);
        } else {
          say(`open: no game called "${args[0] ?? ''}". Try: games`);
        }
        break;
      }
      case 'stack':
      case 'skills':
        say(
          'game dev   Unity · C# · gameplay programming · game systems',
          'software   Python · APIs · automation · Git · CI/CD',
          'ai         generative AI · AI APIs · automation · AI-assisted dev',
        );
        break;
      case 'contact': {
        const live = CONTACT_LINKS.filter((l) => l.url);
        if (live.length) say(...live.map((l) => `${l.label.padEnd(10, ' ')}${l.url}`));
        else say('Contact links are coming soon.');
        break;
      }
      case 'secrets':
        say(`${unlocked.length}/${ACHIEVEMENTS.length} secrets found. (Hint: the footer has a list.)`);
        break;
      case 'zombie':
        toggleZombieMode();
        say(zombieStore.get() ? 'brains… BRAINS…' : 'Cured. Phew.');
        break;
      case 'fish':
      case 'cast':
        say('You cast a line…', '…something is down there.', 'Result: ??? — UNKNOWN FISH (rarity: ???)', 'The real ones live in BLOODCAST.');
        break;
      case 'rain':
        makeItRainFish();
        say('Splash.');
        break;
      case 'sudo':
        say('Nice try. This incident will be reported to Byte.');
        break;
      case 'rm':
        say('Byte ate that command. Nothing was deleted.');
        break;
      case 'echo':
        say(args.join(' '));
        break;
      case 'date':
        say(new Date().toDateString());
        break;
      case 'hi':
      case 'hello':
      case 'hey':
        say('Hi there! Try "help".');
        break;
      case 'exit':
      case 'quit':
        say('There is no exit. Only more games.');
        break;
      case 'clear':
        setLines([]);
        unlock('hello-world');
        return;
      default:
        say(`command not found: ${name}. Type "help".`);
    }
    if (name) unlock('hello-world');
    setLines((prev) => [...prev, ...out].slice(-60));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value.trim()) history.current.push(value.trim());
      cursor.current = -1;
      run(value);
      setValue('');
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const h = history.current;
      if (!h.length) return;
      e.preventDefault();
      if (e.key === 'ArrowUp') cursor.current = cursor.current < 0 ? h.length - 1 : Math.max(0, cursor.current - 1);
      else cursor.current = cursor.current < 0 ? -1 : cursor.current + 1;
      if (cursor.current >= h.length) cursor.current = -1;
      setValue(cursor.current < 0 ? '' : h[cursor.current]);
    } else if (e.key === 'Tab' && value.trim() && !value.includes(' ')) {
      const match = COMMANDS.find((c) => c.startsWith(value.trim().toLowerCase()));
      if (match) {
        e.preventDefault();
        setValue(`${match} `);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="term" data-cursor="Type">
      <div className="term__bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <p>byte@zombyte: ~</p>
      </div>
      <div ref={bodyRef} className="term__body" role="log" aria-live="polite" aria-label="Terminal output" onClick={() => inputRef.current?.focus()}>
        {lines.map((l, i) => (
          <p key={i} className={`term__line term__line--${l.kind}`}>
            {l.kind === 'in' ? <span className="term__prompt" aria-hidden="true">{PROMPT} </span> : null}
            {l.text}
          </p>
        ))}
      </div>
      <form
        className="term__form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <span className="term__prompt" aria-hidden="true">
          {PROMPT}
        </span>
        <input
          ref={inputRef}
          className="term__input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          aria-label='Terminal command — try "help"'
          placeholder="help"
        />
      </form>
    </div>
  );
}
