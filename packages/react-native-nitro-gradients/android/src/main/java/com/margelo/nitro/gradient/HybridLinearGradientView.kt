package com.margelo.nitro.gradient

import android.content.Context
import android.graphics.LinearGradient
import android.graphics.Shader
import android.view.View
import androidx.annotation.Keep
import com.facebook.common.internal.DoNotStrip
import kotlin.math.tan

private fun getHorizontalOrVerticalStartPoint(angle: Float, halfWidth: Float, halfHeight: Float): Pair<Float, Float> {
    if (angle == 0f) {
        return Pair(-halfWidth, 0f)
    } else if (angle == 90f) {
        return Pair(0f, -halfHeight)
    } else if (angle == 180f) {
        return Pair(halfWidth, 0f)
    } else {
        return Pair(0f, halfHeight)
    }
}

private fun getStartCornerToIntersect(angle: Float, halfWidth: Float, halfHeight: Float): FloatArray { // TODO: streamline return type
    if (angle < 90f) {
        return floatArrayOf(-halfWidth, -halfHeight)
    } else if (angle < 180f) {
        return floatArrayOf(halfWidth, -halfHeight)
    } else if (angle < 270f) {
        return floatArrayOf(halfWidth, halfHeight)
    } else {
        return floatArrayOf(-halfWidth, halfHeight)
    }
}

private fun getGradientStartPoint(angle: Float, hWidth: Float, hHeight: Float): Pair<Float, Float> { // TODO: streamline return type
    var angle = angle
    angle = angle % 360f
    if (angle < 0f) angle += 360f

    if (angle % 90 == 0f) {
        return getHorizontalOrVerticalStartPoint(angle, hWidth, hHeight)
    }

    val slope = tan(angle * Math.PI / 180.0f).toFloat()
    val perpendicularSlope = -1 / slope
    val startCorner: FloatArray = getStartCornerToIntersect(angle, hWidth, hHeight)
    val b = startCorner[1] - perpendicularSlope * startCorner[0]
    val startX = b / (slope - perpendicularSlope)
    val startY = slope * startX

    return Pair(startX, startY)
}

class LinearGradientDrawable : BaseGradientDrawable() {
    private var tileMode = Shader.TileMode.CLAMP
    private var colorInts: IntArray = intArrayOf()
    private var colorPositions: FloatArray? = null
    private var startX = 0f
    private var startY = 0f
    private var endX = 1f
    private var endY = 0f

    fun setColors(colors: DoubleArray) {
        colorInts = colors.map { it.toInt() }.toIntArray()
    }

    fun setTileMode(value: Shader.TileMode) {
        tileMode = value
    }

    fun setPositions(positions: FloatArray?) {
        colorPositions = positions
    }

    fun setStart(start: Vector, width: Int, height: Int, density: Float) {
        val xPixels = parseCoordinate(start.x, width, height, density, width)
        val yPixels = parseCoordinate(start.y, width, height, density, height)
        startX = if (width > 0) xPixels / width.toFloat() else 0f
        startY = if (height > 0) yPixels / height.toFloat() else 0f
    }

    fun setEnd(end: Vector, width: Int, height: Int, density: Float) {

        if(width == 0 || height == 0){
            return;
        }

        val xPixels = parseCoordinate(end.x, width, height, density, width)
        val yPixels = parseCoordinate(end.y, width, height, density, height)
        endX = if (width > 0) xPixels / width.toFloat() else 0f
        endY = if (height > 0) yPixels / height.toFloat() else 0f
    }

    fun setPointsFromAngle(angle: Double, width: Int, height: Int) {
        if (width == 0 || height == 0) return
        val adjustedAngle = 90f - angle.toFloat()
        val cx = width / 2f
        val cy = height / 2f
        val relativeStartPoint = getGradientStartPoint(adjustedAngle, cx, cy)

        val absoluteStartX = cx + relativeStartPoint.first
        val absoluteStartY = cy - relativeStartPoint.second
        val absoluteEndX = cx - relativeStartPoint.first
        val absoluteEndY = cy + relativeStartPoint.second

        startX = absoluteStartX / width.toFloat()
        startY = absoluteStartY / height.toFloat()
        endX = absoluteEndX / width.toFloat()
        endY = absoluteEndY / height.toFloat()
    }

    override fun updateShader() {
        val width = bounds.width()
        val height = bounds.height()
        if (colorInts.isEmpty() || width == 0 || height == 0) {
            paint.shader = null
            return
        }

        val x0 = bounds.left + startX * width
        val y0 = bounds.top + startY * height
        val x1 = bounds.left + endX * width
        val y1 = bounds.top + endY * height

        paint.shader = LinearGradient(
            x0, y0, x1, y1,
            colorInts,
            colorPositions,
            tileMode
        )
    }
}

@DoNotStrip
@Keep
class HybridLinearGradientView(context: Context): HybridLinearGradientViewSpec() {
    private val gradientDrawable = LinearGradientDrawable()
    private val gradientView = View(context)
    override val view: View = gradientView
    private val density = context.resources.displayMetrics.density
    private val defaultStart = Vector(
        x = Variant_String_Double.First("50%"),
        y = Variant_String_Double.First("0%")
    )
    private val defaultEnd = Vector(
        x = Variant_String_Double.First("50%"),
        y = Variant_String_Double.First("100%")
    )
    private var isUpdatingConfig = false

    override fun beforeUpdate() {
        isUpdatingConfig = true
    }
    override fun afterUpdate() {
        isUpdatingConfig = false
        gradientDrawable.invalidate()
    }

    private fun invalidate() {
        if (!isUpdatingConfig) gradientDrawable.invalidate()
    }

    private fun updateLinePoints() {
        val w = gradientView.width
        val h = gradientView.height

        val currentAngle = angle
        if (currentAngle != null) {
            gradientDrawable.setPointsFromAngle(currentAngle, w, h)
            return
        }

        gradientDrawable.setStart(start ?: defaultStart, w, h, density)
        gradientDrawable.setEnd(end ?: defaultEnd, w, h, density)
    }

    init {
        gradientView.background = gradientDrawable
        gradientView.addOnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
            val w = gradientView.width
            val h = gradientView.height
            if (w > 0 && h > 0) {
                updateLinePoints()
                invalidate()
            }
        }
    }

    override var blur: Double? = null
        set(value) {
            if (field != value) {
                field = value
                applyBlurToView(gradientView, value, tileMode)
            }
        }

    override var tileMode: String? = null
        set(value) {
            if (field != value) {
                field = value
                gradientDrawable.setTileMode(value.toTileMode())
                applyBlurToView(gradientView, blur, value)
            }
        }

    override var colors: DoubleArray = doubleArrayOf()
        set(value) {
            if (!field.contentEquals(value)) {
                field = value
                gradientDrawable.setColors(value)
            }
        }

    override var positions: DoubleArray? = null
        set(value) {
            if (!field.contentEquals(value)) {
                field = value
                gradientDrawable.setPositions(value?.map { it.toFloat() }?.toFloatArray())
            }
        }

    override var angle: Double? = null
        set(value) {
            if (field != value) {
                field = value
                if (gradientView.width > 0 && gradientView.height > 0) {
                    updateLinePoints()
                }
            }
        }

    override var start: Vector? = null
        set(value) {
            if (field != value) {
                field = value
                if (angle == null && gradientView.width > 0 && gradientView.height > 0) {
                    updateLinePoints()
                }
            }
        }

    override var end: Vector? = null
        set(value) {
            if (field != value) {
                field = value
                if (angle == null && gradientView.width > 0 && gradientView.height > 0) {
                    updateLinePoints()
                }
            }
        }

    override fun update(
        colors: DoubleArray,
        positions: DoubleArray?,
        start: Vector?,
        end: Vector?,
        angle: Double?,
        blur: Double?,
        tileMode: String?
    ) {
        beforeUpdate()
        try {
            this.colors = colors
            this.positions = positions
            this.angle = angle
            this.start = start
            this.end = end
            this.blur = blur
            this.tileMode = tileMode
        } finally {
            afterUpdate()
        }
    }
}
