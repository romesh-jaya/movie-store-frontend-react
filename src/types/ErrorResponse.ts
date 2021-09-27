export type ErrorResponse = {
  response: {
    data: {
      Error: string;
    };
  };
};

// Type guard with "type predicate"
export function isErrorResponse(candidate: any): candidate is ErrorResponse {
  return !!candidate.response.data.Error;
}
