from fastapi import Request, status
from fastapi.responses import JSONResponse
from typing import Union, Dict, Any
import logging
import traceback
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ErrorHandler:
    """
    Middleware for handling various types of exceptions and errors
    """
    
    async def __call__(
        self, request: Request, call_next
    ) -> Union[JSONResponse, Any]:
        try:
            # Process the request
            return await call_next(request)
            
        except Exception as e:
            # Log the error with stack trace
            logger.error(
                f"Error processing request: {str(e)}\n"
                f"Path: {request.url.path}\n"
                f"Method: {request.method}\n"
                f"Traceback: {traceback.format_exc()}"
            )
            
            # Prepare error response
            error_response = self._prepare_error_response(e)
            return JSONResponse(
                status_code=error_response["status_code"],
                content=error_response["content"]
            )
    
    def _prepare_error_response(self, error: Exception) -> Dict[str, Any]:
        """
        Prepare appropriate error response based on exception type
        """
        # Default error response
        response = {
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            "content": {
                "timestamp": datetime.utcnow().isoformat(),
                "error": "Internal Server Error",
                "message": str(error)
            }
        }
        
        # Custom error handling based on exception type
        if hasattr(error, "status_code"):
            response["status_code"] = error.status_code
            response["content"]["error"] = error.__class__.__name__
        
        return response 