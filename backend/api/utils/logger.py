import logging
import logging.handlers
import os
from datetime import datetime

class LogConfig:
    """
    Centralized logging configuration for the application
    """
    
    def __init__(self):
        # Create logs directory if it doesn't exist
        self.logs_dir = "logs"
        os.makedirs(self.logs_dir, exist_ok=True)
        
        # Configure root logger
        self.setup_root_logger()
        
        # Create application logger
        self.logger = logging.getLogger("cerebro")
        self.setup_app_logger()
    
    def setup_root_logger(self):
        """
        Configure the root logger with basic settings
        """
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
    
    def setup_app_logger(self):
        """
        Configure application-specific logger with file handlers
        """
        self.logger.setLevel(logging.INFO)
        
        # Create handlers
        self._add_file_handler("error", logging.ERROR)
        self._add_file_handler("info", logging.INFO)
        self._add_console_handler()
        
        # Prevent propagation to root logger
        self.logger.propagate = False
    
    def _add_file_handler(self, level_name: str, level: int):
        """
        Add a file handler for the specified logging level
        """
        # Create filename with current date
        date_str = datetime.now().strftime("%Y-%m-%d")
        filename = os.path.join(
            self.logs_dir,
            f"cerebro_{level_name}_{date_str}.log"
        )
        
        # Configure handler
        handler = logging.handlers.RotatingFileHandler(
            filename,
            maxBytes=10485760,  # 10MB
            backupCount=5
        )
        handler.setLevel(level)
        
        # Add formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        
        self.logger.addHandler(handler)
    
    def _add_console_handler(self):
        """
        Add console handler for development environment
        """
        handler = logging.StreamHandler()
        handler.setLevel(logging.INFO)
        
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        
        self.logger.addHandler(handler)

# Create global logger instance
log_config = LogConfig()
logger = log_config.logger 