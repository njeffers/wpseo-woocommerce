def runTests( phpVersion ) {
    docker.image( "wordpressdevelop/php:${phpVersion}-fpm" ).inside {
        stage( "${phpVersion} Tests" ){
            sh 'docker-php-ext-enable xdebug'
	        sh 'm -f /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini'
            sh "vendor/bin/phpunit -c phpunit.xml.dist --log-junit build/logs/junit-${phpVersion}.xml --coverage-html build/coverage-${phpVersion} --coverage-clover build/logs/clover-${phpVersion}.xml"
            junit "build/logs/junit-${phpVersion}.xml"
            step ([
                $class: 'CloverPublisher',
                cloverReportDir: "build/coverage-${phpVersion}",
                cloverReportFileName: "../logs/clover-${phpVersion}.xml",
                healthyTarget: [ methodCoverage: 70, conditionalCoverage: 80, statementCoverage: 80 ],
                unhealthyTarget: [ methodCoverage: 50, conditionalCoverage: 50, statementCoverage: 50 ],
                failingTarget: [ methodCoverage: 0, conditionalCoverage: 0, statementCoverage: 0 ]
            ] )
        }
    }
}

node( 'docker-agent' ) {
    checkout scm
    def workspace = pwd()
    docker.image( 'yoastseo/docker-php-composer-node:latest' ).inside {
        stage( 'Install' ) {
            sh 'composer install --no-interaction'
            sh 'mkdir -p build/logs'
        }
    }
    parallel(
        other: {
            docker.image( 'wordpressdevelop/php:7.3-fpm' ).inside {
                parallel(
                    phplint: {
                        stage( 'Linting' ) {
                            sh 'find -L . -path ./vendor -prune -o -path ./node_modules -prune -o -name "*.php" -print0 | xargs -0 -n 1 -P 4 php -l'
                        }
                    },
                    phpcs: {
                        stage( 'Codestyle' ) {
                            sh 'vendor/bin/phpcs --report=checkstyle --report-file=`pwd`/build/logs/checkstyle.xml || exit 0'
                            def checkstyle = scanForIssues tool: checkStyle(pattern: 'build/logs/checkstyle.xml')
                            publishIssues issues: [checkstyle]
                        }
                    },
                    phpmd: {
                        stage( 'Mess detection' ) {
                            sh 'vendor/bin/phpmd . xml build/phpmd.xml --reportfile build/logs/pmd.xml --exclude vendor/ --exclude build/ || exit 0'
                            def pmd = scanForIssues tool: pmdParser(pattern: 'build/logs/pmd.xml')
                            publishIssues issues: [pmd]
                        }
                    },
                    securitycheck: {
                        stage( 'Security check' ) {
                            sh 'vendor/bin/security-checker security:check composer.lock'
                        }
                    }
                )
            }
        },
        php74: {
            runTests( '7.4' );
        },
        php73: {
            runTests( '7.3' );
        },
        php56: {
            runTests( '5.6' );
        }
    )
}
