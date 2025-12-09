package com.margelo.nitro.gradient

import android.graphics.Canvas
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Rect
import android.graphics.Shader
import android.graphics.drawable.Drawable
import android.util.Log
import kotlin.math.tan

private fun getHorizontalOrVerticalStartPoint(angle: Float, halfWidth: Float, halfHeight: Float): Pair<Float, Float> {
    if (angle == 0f) {
        // Horizontal, left-to-right
        return Pair(-halfWidth, 0f)
    } else if (angle == 90f) {
        // Vertical, bottom-to-top
        return Pair(0f, -halfHeight)
    } else if (angle == 180f) {
        // Horizontal, right-to-left
        return Pair(halfWidth, 0f)
    } else {
        // Vertical, top to bottom
        return Pair(0f, halfHeight)
    }
}

private fun getStartCornerToIntersect(angle: Float, halfWidth: Float, halfHeight: Float): FloatArray {
    if (angle < 90f) {
        // Bottom left
        return floatArrayOf(-halfWidth, -halfHeight)
    } else if (angle < 180f) {
        // Bottom right
        return floatArrayOf(halfWidth, -halfHeight)
    } else if (angle < 270f) {
        // Top right
        return floatArrayOf(halfWidth, halfHeight)
    } else {
        // Top left
        return floatArrayOf(-halfWidth, halfHeight)
    }
}

private fun getGradientStartPoint(angle: Float, hWidth: Float, hHeight: Float): Pair<Float, Float> {
    // Bound angle to [0, 360)
    var angle = angle
    angle = angle % 360f
    if (angle < 0f) angle += 360f

    // Explicitly check for horizontal or vertical gradients, as slopes of
    // the gradient line or a line perpendicular will be undefined in that case
    if (angle % 90 == 0f) {
        return getHorizontalOrVerticalStartPoint(angle, hWidth, hHeight)
    }

    // Get the equivalent slope of the gradient line as tan = opposite/adjacent = y/x
    val slope = tan(angle * Math.PI / 180.0f).toFloat()

    // Find the start point by computing the intersection of the gradient line
    // and a line perpendicular to it that intersects the nearest corner
    val perpendicularSlope = -1 / slope

    // Get the start corner to intersect relative to center, in cartesian space (+y = up)
    val startCorner: FloatArray = getStartCornerToIntersect(angle, hWidth, hHeight)

    // Compute b (of y = mx + b) to get the equation for the perpendicular line
    val b = startCorner[1] - perpendicularSlope * startCorner[0]

    // Solve the intersection of the gradient line and the perpendicular line:
    val startX = b / (slope - perpendicularSlope)
    val startY = slope * startX

    return Pair(startX, startY)
}

class LinearGradientDrawable : Drawable() {
    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private var shader: Shader? = null
    private var isDirty = true
    private var lastBoundsWidth = 0
    private var lastBoundsHeight = 0

    private var colorInts: IntArray = intArrayOf()
    private var colorPositions: FloatArray? = null
    private var startX = 0f
    private var startY = 0f
    private var endX = 1f
    private var endY = 0f

    fun setColors(colors: DoubleArray) {
        if (!colorInts.contentEquals(colors.map { it.toInt() }.toIntArray())) {
            colorInts = colors.map { it.toInt() }.toIntArray()
            isDirty = true
        }
    }

    fun setPositions(positions: FloatArray?) {
        if (!colorPositions.contentEquals(positions)) {
            colorPositions = positions
            isDirty = true
        }
    }

    fun setStart(start: Vector, width: Int, height: Int, density: Float) {
        val xPixels = parseCoordinate(start.x, width, height, density, width)
        val yPixels = parseCoordinate(start.y, width, height, density, height)
        val x = if (width > 0) xPixels / width.toFloat() else 0f
        val y = if (height > 0) yPixels / height.toFloat() else 0f
        if (startX != x || startY != y) {
            startX = x
            startY = y
            isDirty = true
        }
    }

    fun setEnd(end: Vector, width: Int, height: Int, density: Float) {
        val xPixels = parseCoordinate(end.x, width, height, density, width)
        val yPixels = parseCoordinate(end.y, width, height, density, height)
        val x = if (width > 0) xPixels / width.toFloat() else 0f
        val y = if (height > 0) yPixels / height.toFloat() else 0f
        if (endX != x || endY != y) {
            endX = x
            endY = y
            isDirty = true
        }
    }

    fun setPointsFromAngle(angle: Double, width: Int, height: Int){
        if(width == 0 || height == 0){
            return
        }
        val adjustedAngle = 90 - angle.toFloat()
        val cx = width / 2f
        val cy = height / 2f
        val relativeStartPoint = getGradientStartPoint(adjustedAngle, cx, cy)

        // Convert absolute coordinates to normalized (0-1) coordinates
        val absoluteStartX = cx + relativeStartPoint.first
        val absoluteStartY = cy - relativeStartPoint.second
        val absoluteEndX = cx - relativeStartPoint.first  // Fixed: use cx instead of cy
        val absoluteEndY = cy + relativeStartPoint.second

        // Normalize coordinates to 0-1 range (consistent with setStart/setEnd)
        val newStartX = absoluteStartX / width.toFloat()
        val newStartY = absoluteStartY / height.toFloat()
        val newEndX = absoluteEndX / width.toFloat()
        val newEndY = absoluteEndY / height.toFloat()

        startX = newStartX
        startY = newStartY
        endX = newEndX
        endY = newEndY
        isDirty = true
    }
    
    
    fun invalidate() {
        if (isDirty) {
            rebuildShader(bounds)
            invalidateSelf()
        }
    }

    override fun onBoundsChange(bounds: Rect) {
        super.onBoundsChange(bounds)
        if (bounds.width() != lastBoundsWidth || bounds.height() != lastBoundsHeight) {
            isDirty = true
            lastBoundsWidth = bounds.width()
            lastBoundsHeight = bounds.height()
        }
    }

    private fun rebuildShader(bounds: Rect) {
        if (colorInts.isEmpty()) {
            shader = null
            isDirty = false
            return
        }
        val width = bounds.width().toFloat()
        val height = bounds.height().toFloat()
        if (width == 0f || height == 0f) return
        
        val x0 = bounds.left + startX * width
        val y0 = bounds.top + startY * height
        val x1 = bounds.left + endX * width
        val y1 = bounds.top + endY * height
        
        shader = LinearGradient(
            x0, y0, x1, y1,
            colorInts,
            colorPositions,
            Shader.TileMode.CLAMP
        )
        paint.shader = shader
        isDirty = false
    }

    override fun draw(canvas: Canvas) {
        if (isDirty || paint.shader == null) rebuildShader(bounds)
        if (paint.shader == null) return
        canvas.drawRect(bounds, paint)
    }

    override fun setAlpha(alpha: Int) {
        paint.alpha = alpha
        invalidateSelf()
    }

    override fun getOpacity(): Int {
        return android.graphics.PixelFormat.TRANSLUCENT
    }

    override fun setColorFilter(colorFilter: android.graphics.ColorFilter?) {
        paint.colorFilter = colorFilter
        invalidateSelf()
    }
}


