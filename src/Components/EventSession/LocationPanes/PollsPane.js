import React from "react";
import { makeStyles, Typography, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  emptyPane: {
    marginTop: theme.spacing(4),
    textAlign: "center"
  },
  emptyImage: {
    width: "55%",
    marginBottom: theme.spacing(1)
  }
}));
const PollsPane = () => {
  const classes = useStyles();

  return (
    <div>
      <Box className={classes.emptyPane}>
        <img
          className={classes.emptyImage}
          src="/illustrations/polls.svg"
          alt="Polls coming soon"
        />
        <Typography variant="body2" color="textSecondary" display="block">
          Coming soon...
        </Typography>
      </Box>
    </div>
  );
};

export default PollsPane;
