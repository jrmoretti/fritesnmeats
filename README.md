# Frites N Meats Slack Integration

| Command                                                    | Description                                                                                        | Example                                        
|------------------------------------------------------------|----------------------------------------------------------------------------------------------------|------------------------------------------------
| /fritesnmeats [addOrder] [order]                           | Register an order                                                                                  | /fritesnmeats addOrder burger of the day
| /fritesnmeats [order]                                      | Will submit an order based on what you added above                                                 | /fritesnmeats order marwan, fernando, owen     
| /fritesnmeats [alias] [unique alias]                       | Registers an alias to make an order with your alias name instead of your slack prefixed user name  | /fritenmeats BOTW                               

## Todo

| Command                                                    | Description                                                                                | Example                                        
|------------------------------------------------------------|--------------------------------------------------------------------------------------------|------------------------------------------------
| /fritesnmeats [orderFor] [comma separated users/aliases]   | Will match predefined orders based on people's orders                                      | /fritesnmeats order marwan, fernando, owen     
| /fritesnmeats [BOTW]                                       | Sends back burger of the week.                                                             | /fritenmeats BOTW                               
| /fritesnmeats [users]                                      | sends back all registered users so you can order for them                                  | /fritenmeats users                               
