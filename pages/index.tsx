import React, { useRef } from 'react';
import { ReadTransaction, Replicache, TEST_LICENSE_KEY, WriteTransaction } from 'replicache';
import { useSubscribe } from 'replicache-react';
import { nanoid } from 'nanoid';

type Message = {
  id: string,
  from: string,
  content: string,
  order: number
}

const mutators = {
  async createMessage(tx: WriteTransaction, { id, from, content, order }: Message) {
    await tx.put(`message/${id}`, {
      from,
      content,
      order,
    });
  },
};
const rep = process.browser
  ? new Replicache({
    name: 'chat-user-id',
    licenseKey: TEST_LICENSE_KEY,
    pushURL: '/api/replicache-push',
    pullURL: '/api/replicache-pull',
    mutators,
  })
  : null;

if (rep) {
  listen(rep);
}

type M = typeof mutators;

export default function Home() {
  return <Chat rep={rep} />;
}

function Chat({ rep }: { rep: Replicache<M> | null }) {
  const messages = useSubscribe(
    rep,
    async (tx: ReadTransaction) => {
      const messages = (await tx.scan({ prefix: 'message/' }).entries().toArray()) as [string, Message][];
      console.log(messages)
      return messages;
    },
    [],
  );

  const usernameRef = useRef(null);
  const contentRef = useRef(null);

  const onSubmit = (e: any) => {
    e.preventDefault();
    const lastIndex = messages.length-1;
    const last = messages[lastIndex][1];
    const order = (last?.order ?? 0) + 1;
    rep?.mutate.createMessage({
      id: nanoid(),
      from: '123',
      content: 'some content',
      order,
    } as Message);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input ref={usernameRef} style={styles.username} required />
        says:
        <input ref={contentRef} style={styles.content} required />
        <input type="submit" />
      </form>
      <MessageList messages={messages} />
    </div>
  );
}

function MessageList({ messages }: { messages: [string, Message][] }) {
  return (
    <div>
      {
        messages.map(([k, v]) => {
          //console.log(message)
          return (
            <div key={k}>
              <b>{v.from}: </b>
              {v.content}
            </div>
          );
        })
      }
    </div>);
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    flex: 0,
    marginBottom: '1em',
  },
  username: {
    flex: 0,
    marginRight: '1em',
  },
  content: {
    flex: 1,
    maxWidth: '30em',
    margin: '0 1em',
  },
};

function listen(rep) {
  // TODO: Listen for changes on server
}