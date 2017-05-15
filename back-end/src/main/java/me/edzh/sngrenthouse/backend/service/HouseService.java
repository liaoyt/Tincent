package me.edzh.sngrenthouse.backend.service;

import me.edzh.sngrenthouse.backend.controller.form.FilterForm;
import me.edzh.sngrenthouse.backend.model.House;

import java.util.List;

/**
 * Created by Edward on 2017/5/5 005.
 */
public interface HouseService {
    List<House> housesWithFilter(FilterForm form);
}
