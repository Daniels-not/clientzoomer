import React, { useContext } from 'react'
import { Grid, Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SocketContext } from '../SocketConfigProvider';

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },
}));

export const VideoPlayer = () => {

  const classes = useStyles();

  const {
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    name,
    callEnded,
  } = useContext(SocketContext);

  return (
    <div>
      {/* our video player */}
      <Grid container className={useStyles().gridContainer}>
        {
          stream && (
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>
                <Typography variant="h5" gutterButton>{ name || 'Name 😀' }</Typography>
                <video autoPlay playsInline muted className={classes.video} ref={myVideo}/>
              </Paper>
            </Grid>
          )
        }
        {/* user video */}
        {
          callAccepted && !callEnded && (
            <Grid item xs={12} sm={6}>
              <Paper className={classes().paper}>
                <Typography variant="h5">{ call.name || 'Name 😀' }</Typography>
                <video autoPlay playsInline muted className={classes().video} ref={userVideo}/>
              </Paper>
            </Grid>
          )
        }
      </Grid>
    </div>
  )
}

export default VideoPlayer;