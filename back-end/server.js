import app from "./src/app.js";
import { config } from "./src/config/config.js";



app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
