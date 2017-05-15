package me.edzh.sngrenthouse.backend.controller;

/**
 * Created by Edward on 2016/8/10.
 */

import me.edzh.sngrenthouse.backend.model.Response;
import me.edzh.sngrenthouse.backend.utils.JsonDateValueProcessor;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.apache.log4j.Logger;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

public class BaseGlobalExceptionHandler {
    static Logger logger = Logger.getLogger(BaseGlobalExceptionHandler.class);
    protected static final String DEFAULT_ERROR_MESSAGE = "系统忙，请稍后再试";

    void respondData(HttpServletResponse response, Response dto) {
        response.setContentType("application/json");
        this.writeToClient(response, dto);
    }
    private static void writeToClient(HttpServletResponse response, Response result) {

        if (null != result) {
            JsonConfig jsonConfig = new JsonConfig();
            jsonConfig.registerJsonValueProcessor(Date.class, new JsonDateValueProcessor());
            writeToClient(response, JSONObject.fromObject(result,jsonConfig).toString());
        }
    }

    private static void writeToClient(HttpServletResponse response , String result) {

        try {
            response.setCharacterEncoding("utf-8");
            response.setHeader("Content-type", "application/json;charset=UTF-8");
            response.getWriter().write(result);
        }catch (IOException e){
            logger.error("---write to Client error");
            e.printStackTrace();
        }
    }
}
