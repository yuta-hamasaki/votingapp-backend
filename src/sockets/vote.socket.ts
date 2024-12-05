import { Server, Socket } from 'socket.io';
import Poll from '../models/Poll.models';

const voteSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log("connected");

    socket.on('joinPoll', async (pollId: string) => {
      try {
        const poll = await Poll.findById(pollId);
        if (!poll) {
          socket.emit('error', { message: 'Poll not found' });
          return;
        }
        socket.join(pollId);
        console.log(`User joined poll room: ${pollId}`);
        socket.emit('pollData', poll);
      } catch (error) {
        console.error('Error joining poll room:', error);
        socket.emit('error', { message: 'Error joining poll room' });
      }
    });


    socket.on('vote', async (data: { pollId: string, optionIndex: number }) => {
      console.log('Vote received:', data);
      try {
        const { pollId, optionIndex } = data;
        const poll = await Poll.findById(pollId);
        
        if (!poll) {
          socket.emit('error', { message: 'Poll not found' });
          return;
        }
        if (optionIndex < 0 || optionIndex >= poll.options.length) {
          socket.emit('error', { message: 'Thats not possible' });
          return;
        }

        poll.options[optionIndex].votes++;
        await poll.save();

        io.to(pollId).emit('voteUpdate', poll);
      } catch (error) {
        console.error('Vote error:', error);
        socket.emit('error', { message: 'Error voting' });
      }
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });
  });
};

export default voteSocket;