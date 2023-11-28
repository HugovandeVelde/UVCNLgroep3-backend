// export async function responseExample(req, res) {
//   res.status(200).send('everything went well');
// }

// export async function updateExample(req, res) {
//   let body = req.body;
//   res.status(200).send(`Hi 🤭; I got this data: ${JSON.stringify(body)}?`);
// }
// import data from './clients.json' assert { type: 'json' };

// export async function getAllClients(req, res) {
//   try {
//     //set header before response
//     res.status(200).send(data);
//   } catch (err) {
//     next(err);
//   }
// }
import data from '../../users.db' assert { type: 'json' };

export async function getAllClients(req, res) {
  try {
    //set header before response
    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
}



