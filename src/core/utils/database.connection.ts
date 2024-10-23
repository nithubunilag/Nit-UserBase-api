import { logger, sequelize } from '@/core';

export const initializeDbConnection = async () => {
    try {
          await sequelize.authenticate();

          await sequelize.sync();

          logger.info('Connection has been established successfully.');
    } catch (error) {
        console.log(error)

        throw error
    }
  
};
