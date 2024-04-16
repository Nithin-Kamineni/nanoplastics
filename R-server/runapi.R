library(plumber)
#setwd(dir = here::here())
# script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)
# Set the working directory to the script's directory
# setwd(script_dir)


r <- plumber::plumb(file = 'R-api.R')


r$run(port = 9005, host="0.0.0.0", swagger=TRUE)




