import type { NextApiRequest, NextApiResponse } from 'next'


export default handlePull;

async function handlePull(req: NextApiRequest, res: NextApiResponse) {
  res.json({
    // We will discuss these two fields in later steps.
    lastMutationID: 0,
    cookie: null,
    patch: [
      {op: 'clear'},
      {
        op: 'put',
        key: 'message/qpdgkvpb9ao',
        value: {
          from: 'Jane',
          content: "Hey, what's for lunch?",
          order: 1,
        },
      },
      {
        op: 'put',
        key: 'message/5ahljadc408',
        value: {
          from: 'Fred',
          content: 'tacos?',
          order: 2,
        },
      },
    ],
  });
  res.end();
}