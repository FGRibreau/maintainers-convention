##
# NAME             : fgribreau/maintainers-convention
# VERSION          : latest
# DOCKER-VERSION   : 1.5
# DESCRIPTION      :
# TO_BUILD         : docker build --rm --pull=true --no-cache -t fgribreau/maintainers-convention .
# TO_SHIP          : docker push fgribreau/maintainers-convention
# TO_RUN           : docker run --rm -it fgribreau/maintainers-convention
##

FROM iadvize/nodejs:6
MAINTAINER François-Guillaume Ribreau <docker@fgribreau.com>

COPY . /app

WORKDIR /app

RUN npm install

CMD ["npm", "start"]
