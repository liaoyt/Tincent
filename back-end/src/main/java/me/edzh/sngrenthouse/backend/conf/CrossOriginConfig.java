package me.edzh.sngrenthouse.backend.conf;

import org.apache.log4j.Logger;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Created by Edward on 2017/5/7 007.
 */

@Configuration
@EnableWebMvc
public class CrossOriginConfig extends WebMvcConfigurerAdapter{
    private Logger logger = Logger.getLogger(CrossOriginConfig.class);
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        logger.info("CORS init");
        registry.addMapping("/**");
    }
}
