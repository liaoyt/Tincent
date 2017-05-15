package me.edzh.sngrenthouse.backend.controller;

import me.edzh.sngrenthouse.backend.controller.form.FilterForm;
import me.edzh.sngrenthouse.backend.model.House;
import me.edzh.sngrenthouse.backend.model.Response;
import me.edzh.sngrenthouse.backend.service.HouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by Edward on 2017/5/5 005.
 */
@CrossOrigin("*")
@Controller("MainController")
@RequestMapping("")
public class MainController {

    private final HouseService houseService;

    @Autowired
    public MainController(HouseService houseService) {
        this.houseService = houseService;
    }

    @RequestMapping(value = "/filter", method = RequestMethod.POST)
    @ResponseBody
    public Response<List<House>> filter(@RequestBody FilterForm form){
        return new Response<List<House>>(houseService.housesWithFilter(form));
    }
}
