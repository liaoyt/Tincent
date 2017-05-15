package me.edzh.sngrenthouse.backend.controller.form;

import java.math.BigDecimal;
import java.util.List;

/**
 * Created by Edward on 2017/5/5 005.
 */
public class FilterForm {
    private List<List<BigDecimal>> points;
    private Long distanceRange;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    public List<List<BigDecimal>> getPoints() {
        return points;
    }

    public void setPoints(List<List<BigDecimal>> points) {
        this.points = points;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    public Long getDistanceRange() {
        return distanceRange;
    }

    public void setDistanceRange(Long distanceRange) {
        this.distanceRange = distanceRange;
    }
}
