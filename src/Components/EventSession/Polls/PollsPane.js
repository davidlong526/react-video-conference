import React, { useState } from "react";
import {
  makeStyles,
  /* Typography, Box , */ Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  Box
} from "@material-ui/core";
import NoPollsImg from "../../../Assets/illustrations/polls.svg";
import { CreatePollDialog } from "./CreatePollDialog";
import PollsContext from "../../../Contexts/PollsContext";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  POLLS_NAMESPACES,
  POLLS_STATES
} from "../../../Modules/pollsOperations";
import PollForm from "./PollForm";
import PollResults from "./PollResults";
import {
  getEventSessionDetails,
  isEventOwner as isEventOwnerSelector,
  getUserId
} from "../../../Redux/eventSession";
import { useSelector, shallowEqual } from "react-redux";
import PollsMenu from "./PollsMenu";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  emptyPane: {
    marginTop: theme.spacing(4),
    textAlign: "center"
  },
  emptyImage: {
    width: "55%",
    marginBottom: theme.spacing(1)
  },
  centerButton: {
    width: "100%",
    textAlign: "center"
  }
}));

const PollsPane = () => {
  const classes = useStyles();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);
  const isEventOwner = useSelector(isEventOwnerSelector);

  const isPollCreationAllowed = React.useMemo(
    () =>
      isEventOwner ||
      (eventSessionDetails && eventSessionDetails.allowPollCreation === true),
    [eventSessionDetails, isEventOwner]
  );
  const myUserId = useSelector(getUserId);

  const { polls, myVotes } = React.useContext(PollsContext);

  const publishedPolls = React.useMemo(() => {
    let result = _.filter(
      polls[POLLS_NAMESPACES.GLOBAL],
      (p) => p.state === POLLS_STATES.PUBLISHED
    );
    return result;
  }, [polls]);

  const draftPolls = React.useMemo(() => {
    let result = _.filter(
      polls[POLLS_NAMESPACES.GLOBAL],
      (p) => p.state === POLLS_STATES.DRAFT && p.owner === myUserId
    );
    return result;
  }, [myUserId, polls]);

  const stoppedPolls = React.useMemo(() => {
    let result = _.filter(
      polls[POLLS_NAMESPACES.GLOBAL],
      (p) =>
        p.state === POLLS_STATES.TERMINATED &&
        (p.owner === myUserId || isEventOwner)
    );
    return result;
  }, [isEventOwner, myUserId, polls]);

  console.log({ publishedPolls, draftPolls, stoppedPolls });
  // const hasDraft = useMemo(() => {
  //   isEventOwner && _.findIndex(polls, (p) => p.state === POLLS_STATES.DRAFT);
  // }, [isEventOwner, polls]);

  return (
    <div>
      <CreatePollDialog open={createDialogOpen} setOpen={setCreateDialogOpen} />
      {publishedPolls.length === 0 && (
        <Box className={classes.emptyPane}>
          <img
            className={classes.emptyImage}
            src={NoPollsImg}
            alt="No polls available"
          />
          {isPollCreationAllowed && (
            <Typography variant="body2" color="textSecondary" display="block">
              There are no polls available yet.
              <br />
              Create a poll and start gathering feedback...
            </Typography>
          )}
          {!isPollCreationAllowed && (
            <Typography variant="body2" color="textSecondary" display="block">
              The organizer hasn't created any poll yet. <br />
              Check again later.
            </Typography>
          )}
        </Box>
      )}
      {publishedPolls.length > 0 && (
        <>
          <Typography variant="button">Live Polls</Typography>
          {publishedPolls.map((poll) => {
            const canManagePoll = poll.owner === myUserId || isEventOwner;
            return (
              <ExpansionPanel key={poll.id}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>
                    {poll.title}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                  style={{ paddingTop: 0, display: "block" }}
                >
                  {(!myVotes[POLLS_NAMESPACES.GLOBAL][poll.id] ||
                    myVotes[POLLS_NAMESPACES.GLOBAL][poll.id].voted !==
                      true) && <PollForm poll={poll} />}
                  {myVotes[POLLS_NAMESPACES.GLOBAL][poll.id] &&
                    myVotes[POLLS_NAMESPACES.GLOBAL][poll.id].voted ===
                      true && <PollResults poll={poll} />}
                  {canManagePoll && <PollsMenu poll={poll} />}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          })}
        </>
      )}
      {isPollCreationAllowed && (
        <Box textAlign="center" mt={2} mb={2}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            className={classes.roomButton}
            onClick={() => setCreateDialogOpen(true)}
            // disabled={participantsAvailable.length <= 1}
          >
            Create poll
          </Button>
        </Box>
      )}
      {draftPolls.length > 0 && (
        <>
          <Typography variant="button">Draft Polls</Typography>
          {draftPolls.map((poll) => {
            const canManagePoll = poll.owner === myUserId || isEventOwner;
            return (
              <ExpansionPanel key={poll.id}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>
                    {poll.title}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                  style={{ paddingTop: 0, display: "block" }}
                >
                  <PollForm poll={poll} />
                  {canManagePoll && <PollsMenu poll={poll} />}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          })}
        </>
      )}
      {stoppedPolls.length > 0 && (
        <>
          <Typography variant="button">Ended Polls</Typography>
          {stoppedPolls.map((poll) => {
            const canManagePoll = poll.owner === myUserId || isEventOwner;
            return (
              <ExpansionPanel key={poll.id}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>
                    {poll.title}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                  style={{ paddingTop: 0, display: "block" }}
                >
                  <PollResults poll={poll} />
                  {canManagePoll && <PollsMenu poll={poll} />}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          })}
        </>
      )}
    </div>
  );
};

export default PollsPane;
