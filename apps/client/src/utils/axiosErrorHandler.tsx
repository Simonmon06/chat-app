import axios from "axios";

export const axiosErrorHandler = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || "An unexpected error occurred.";
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return `An unknown error occurred: ${error}`;
  }
};

// only print the error
export const logAxiosError = (error: unknown, context?: string): void => {
  const errorMessage = axiosErrorHandler(error);

  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401 || error.response?.status === 400) {
      console.log(`${context || "Auth"}: User not authenticated`);
    } else {
      console.error(`${context || "Error"}: ${errorMessage}`);
    }
  } else {
    console.error(`${context || "Error"}: ${errorMessage}`);
  }
};
