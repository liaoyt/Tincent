package me.edzh.sngrenthouse.backend.service.impl;

import me.edzh.sngrenthouse.backend.controller.form.FilterForm;
import me.edzh.sngrenthouse.backend.dao.HouseMapper;
import me.edzh.sngrenthouse.backend.model.House;
import me.edzh.sngrenthouse.backend.service.HouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Edward on 2017/5/5 005.
 */
@Service("HouseServiceImpl")
public class HouseServiceImpl implements HouseService {
    private final HouseMapper houseMapper;

    @Autowired
    public HouseServiceImpl(HouseMapper houseMapper) {
        this.houseMapper = houseMapper;
    }

    @Override
    public List<House> housesWithFilter(FilterForm form) {
        if(form.getDistanceRange() == null){
            form.setDistanceRange(1000L); //默认1km
        }
        return houseMapper.housesWithFilter(form);
    }
}
