library(plumber)
#setwd(dir = here::here())
# Set the working directory to the script's directory
# setwd(dirname(rstudioapi::getSourceEditorContext()$path))


r <- plumber::plumb(file = 'R-api.R')


r$run(port = 9005, host="0.0.0.0", swagger=TRUE)




