import axios from "axios";

export const axiosErrorHandler = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error(
      "Axios error response:",
      error.response?.data?.error || error.message
    );
  } else if (error instanceof Error) {
    console.error("Generic error:", error.message);
  } else {
    console.error("An unknown error occurred:", error);
  }
};
