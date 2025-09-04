function mapGrpcError(err){
  if(!err || typeof err !== 'object') return "Unexpected error occurred.";
  const code = err.code;
  switch(code){
    case 14: return "Service temporarily unavailable. Please try again later.";
    case 3:  return "Invalid request. Please check your input and try again.";
    case 5:  return "Requested resource not found.";
    case 7:  return "Permission denied.";
    case 13: return "Internal service error.";
    default: return err.message || "Unexpected error.";
  }
}
module.exports = { mapGrpcError };
