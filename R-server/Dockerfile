# start from the rocker/r-ver:4.2.3 image
FROM rocker/r-ver:4.3.3

# install the linux libraries needed for plumber
RUN apt-get update -qq && apt-get install -y \
  libssl-dev \
  libcurl4-gnutls-dev

# install plumber
RUN R -e "install.packages(c('Rcpp', 'plumber', 'here', 'rstudioapi', 'mrgsolve', 'dplyr', 'zoo', 'ggplot2', 'patchwork', 'FME', 'tidyr', 'Metrics'))"
RUN R -e "install.packages('plumber')"
RUN R -e "install.packages('here')"
RUN R -e "install.packages('rstudioapi')"
RUN R -e "install.packages('mrgsolve')"
RUN R -e "install.packages('dplyr')"
RUN R -e "install.packages('zoo')"
RUN R -e "install.packages('ggplot2')"
RUN R -e "install.packages('patchwork')"
RUN R -e "install.packages('FME')"
RUN R -e "install.packages('tidyr')"
RUN R -e "install.packages('Metrics')"
RUN R -e "install.packages('minpack.lm')"
RUN R -e "install.packages('gridExtra')"
RUN R -e "install.packages('reshape')"
RUN R -e "install.packages('tidyverse')"
RUN R -e "install.packages('jsonlite')"

# copy everything from the current directory into the container
# Copy only the necessary files and directories
COPY ["input data", "/input data"]
COPY ["R-api.R", "/R-api.R"]
COPY ["runapi.R", "/runapi.R"]

WORKDIR /

# open port 9005 to traffic
EXPOSE 9005

# when the container starts, start the main.R script
ENTRYPOINT ["Rscript", "runapi.R"]

# docker build -t nanoplastics-server .

#docker rmi rserver-image:1.0.0 --force
#docker-compose build
#docker run -p 9000:9000 rserver-image:1.0.0