package me.edzh.sngrenthouse.backend.dao;

import me.edzh.sngrenthouse.backend.controller.form.FilterForm;
import me.edzh.sngrenthouse.backend.model.House;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Edward on 2017/5/5 005.
 */
public interface HouseMapper {
    List<House> housesWithFilter(@Param("filter")FilterForm filterForm);
}
