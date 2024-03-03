const staging = false;

export const searchUrl = staging
  ? ""
  : "https://hxvrlyopp75autzhetz3veck6m0okkcq.lambda-url.ap-south-1.on.aws/";

export const statusUrlPrefix = staging
  ? ""
  : "https://ai-tutor-s3.s3.ap-south-1.amazonaws.com/status";
export const videoUrlPrefix =
  "https://remotionlambda-apsouth1-nxlumuozex.s3.ap-south-1.amazonaws.com/renders/";
export const videoUrlSuffix = "/out.mp4";
export const jokesUrlPrefix = "";

export const loadingStatuses = {
  error: "error",
  init: "init",
  phase1: "phase1",
  voiceGen: "voiceGen",
  phase2: "phase2",
  processed: "processed",
  rendered: "rendered",
};
export const displayStatuses = {
  error: "Something went wrong!",
  init: "Thinking",
  phase1: "Testing mic",
  voiceGen: "Writing things down",
  phase2: "Drawing pictures",
  processed: "Coloring pictures",
  rendered: "Done",
};

export const interFaceTimeoutDuration = 1 * 1000;
export const currentPositionCheckInterval = 1 * 1000;
export const statusPollingInterval = 5 * 1000;
export const wordReadTime = 0.5 * 1000;
export const jokePreTime = 1 * 1000;
export const wordDisplayOffsetTime = 0.4 * 1000;
