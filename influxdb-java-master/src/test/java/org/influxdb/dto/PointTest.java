package org.influxdb.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import org.junit.Test;

/**
 * Test for the Point DTO.
 *
 * @author stefan.majer [at] gmail.com
 *
 */
public class PointTest {

	/**
	 * Test that lineprotocol is conformant to:
	 * 
	 * https://github.com/influxdb/influxdb/blob/master/tsdb/README.md
	 *
	 */
	@Test
	public void lineProtocol() {
		Point point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", 1.0).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=1.0 1");

		point = Point.measurement("test,1").time(1, TimeUnit.NANOSECONDS).addField("a", 1.0).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test\\,1 a=1.0 1");

		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", "A").build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=\"A\" 1");

		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", "A\"B").build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=\"A\\\"B\" 1");

		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", "A\"B\"C").build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=\"A\\\"B\\\"C\" 1");

		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", "A B C").build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=\"A B C\" 1");

		point = Point
				.measurement("test")
				.time(1, TimeUnit.NANOSECONDS)
				.addField("a", "A\"B")
				.addField("b", "D E \"F")
				.build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=\"A\\\"B\",b=\"D E \\\"F\" 1");

		//Integer type
		point = Point.measurement("inttest").time(1, TimeUnit.NANOSECONDS).addField("a", (Integer)1).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("inttest a=1i 1");

		point = Point.measurement("inttest,1").time(1, TimeUnit.NANOSECONDS).addField("a", (Integer)1).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("inttest\\,1 a=1i 1");

		point = Point.measurement("inttest,1").time(1, TimeUnit.NANOSECONDS).addField("a", 1L).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("inttest\\,1 a=1i 1");

		point = Point.measurement("inttest,1").time(1, TimeUnit.NANOSECONDS).addField("a", BigInteger.valueOf(100)).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("inttest\\,1 a=100i 1");
	}

	/**
	 * Test for ticket #44
	 */
	@Test
	public void testTicket44() {
		Point point = Point.measurement("test").time(1, TimeUnit.MICROSECONDS).addField("a", 1.0).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=1.0 1000");

		point = Point.measurement("test").time(1, TimeUnit.MILLISECONDS).addField("a", 1.0).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=1.0 1000000");

		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", 1.0).build();
		BatchPoints batchPoints = BatchPoints.database("db").point(point).build();
		assertThat(batchPoints.lineProtocol()).asString().isEqualTo("test a=1.0 1\n");

		point = Point.measurement("test").time(1, TimeUnit.MICROSECONDS).addField("a", 1.0).build();
		batchPoints = BatchPoints.database("db").point(point).build();
		assertThat(batchPoints.lineProtocol()).asString().isEqualTo("test a=1.0 1000\n");

		point = Point.measurement("test").time(1, TimeUnit.MILLISECONDS).addField("a", 1.0).build();
		batchPoints = BatchPoints.database("db").point(point).build();
		assertThat(batchPoints.lineProtocol()).asString().isEqualTo("test a=1.0 1000000\n");

		point = Point.measurement("test").addField("a", 1.0).time(1, TimeUnit.MILLISECONDS).build();
		batchPoints = BatchPoints.database("db").build();
		batchPoints = batchPoints.point(point);
		assertThat(batchPoints.lineProtocol()).asString().isEqualTo("test a=1.0 1000000\n");

	}

	/**
	 * Test for ticket #54
	 */
	@Test
	public void testTicket54() {
		Byte byteNumber = 100;
		Point point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", byteNumber).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=100i 1");

		int intNumber = 100000000;
		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", intNumber).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=100000000i 1");

		Integer integerNumber = 100000000;
		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", integerNumber).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=100000000i 1");

		AtomicInteger atomicIntegerNumber = new AtomicInteger(100000000);
		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", atomicIntegerNumber).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=100000000i 1");

		Long longNumber = 1000000000000000000L;
		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", longNumber).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=1000000000000000000i 1");

		AtomicLong atomicLongNumber = new AtomicLong(1000000000000000000L);
		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", atomicLongNumber).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=1000000000000000000i 1");

		BigInteger bigIntegerNumber = BigInteger.valueOf(100000000);
		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", bigIntegerNumber).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=100000000i 1");

		Double doubleNumber = Double.valueOf(100000000.0001);
		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", doubleNumber).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=100000000.0001 1");

		Float floatNumber = Float.valueOf(0.1f);
		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", floatNumber).build();
		assertThat(point.lineProtocol()).asString().startsWith("test a=0.10");

		BigDecimal bigDecimalNumber = BigDecimal.valueOf(100000000.00000001);
		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("a", bigDecimalNumber).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test a=100000000.00000001 1");
	}
	
	@Test
	public void testEscapingOfKeysAndValues() {
		// Test escaping of spaces
		Point point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).tag("foo", "bar baz").addField( "a", 1.0 ).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test,foo=bar\\ baz a=1.0 1");
 
		// Test escaping of commas
		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).tag("foo", "bar,baz").addField( "a", 1.0 ).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test,foo=bar\\,baz a=1.0 1");

		// Test escaping of equals sign
		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).tag("foo", "bar=baz").addField( "a", 1.0 ).build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test,foo=bar\\=baz a=1.0 1");

		// Test escaping of escape character
		point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).addField("foo", "test\\test").build();
		assertThat(point.lineProtocol()).asString().isEqualTo("test foo=\"test\\\\test\" 1");
	}

	@Test
	public void testDeprecatedFieldMethodOnlyProducesFloatingPointValues() {
		
		Object[] ints = {(byte) 1, (short) 1, (int) 1, (long) 1, BigInteger.ONE};
		
		for (Object intExample : ints) {
			Point point = Point.measurement("test").time(1, TimeUnit.NANOSECONDS).field("a", intExample ).build();
			assertThat(point.lineProtocol()).asString().isEqualTo("test a=1.0 1");
		}

	}
	/**
	 * Test for issue #117.
	 */
	@Test
	public void testIgnoreNullPointerValue() {
		// Test omission of null values
		Point.Builder pointBuilder = Point.measurement("nulltest").time(1, TimeUnit.NANOSECONDS).tag("foo", "bar");

		pointBuilder.field("field1", "value1");
		pointBuilder.field("field2", (Number) null);
		pointBuilder.field("field3", (Integer) 1);

		Point point = pointBuilder.build();

		assertThat(point.lineProtocol()).asString().isEqualTo("nulltest,foo=bar field1=\"value1\",field3=1.0 1");
	}

	/**
	 * Tests for issue #110
	 */
	@Test(expected = NullPointerException.class)
	public void testAddingTagsWithNullNameThrowsAnError() {
		Point.measurement("dontcare").tag(null, "DontCare");
	}
	
	@Test(expected = NullPointerException.class)
	public void testAddingTagsWithNullValueThrowsAnError() {
		Point.measurement("dontcare").tag("DontCare", null);
	}

	@Test(expected = NullPointerException.class)
	public void testAddingMapOfTagsWithNullNameThrowsAnError() {
		Map<String, String> map = new HashMap<>();
		map.put(null, "DontCare");
		Point.measurement("dontcare").tag(map);
	}

	@Test(expected = NullPointerException.class)
	public void testAddingMapOfTagsWithNullValueThrowsAnError() {
		Map<String, String> map = new HashMap<>();
		map.put("DontCare", null);
		Point.measurement("dontcare").tag(map);
	}
	
	@Test(expected = RuntimeException.class)
	public void testNullValueThrowsExceptionViaAddField() {
		Point.measurement("dontcare").addField("field", (String) null);
	}

	@Test
	public void testEmptyValuesAreIgnored() {
		Point point = Point.measurement("dontcare").tag("key","").addField("dontcare", true).build();
		assertThat(point.getTags().size()).isEqualTo(0);

		point = Point.measurement("dontcare").tag("","value").addField("dontcare", true).build();
		assertThat(point.getTags().size()).isEqualTo(0);

		point = Point.measurement("dontcare").tag(Collections.singletonMap("key", "")).addField("dontcare", true).build();
		assertThat(point.getTags().size()).isEqualTo(0);

		point = Point.measurement("dontcare").tag(Collections.singletonMap("", "value")).addField("dontcare", true).build();
		assertThat(point.getTags().size()).isEqualTo(0);
	}

	/**
	 * Tests for issue #266
	 */
	@Test
	public void testEquals() throws Exception {
		// GIVEN two point objects with identical data
		Map<String, Object> fields = new HashMap<>();
		fields.put("foo", "bar");

		String measurement = "measurement";

		TimeUnit precision = TimeUnit.NANOSECONDS;

		Map<String, String> tags = new HashMap<>();
		tags.put("bar", "baz");

		Long time = System.currentTimeMillis();

		Point p1 = new Point();
		p1.setFields(fields);
		p1.setMeasurement(measurement);
		p1.setPrecision(precision);
		p1.setTags(tags);
		p1.setTime(time);

		Point p2 = new Point();
		p2.setFields(fields);
		p2.setMeasurement(measurement);
		p2.setPrecision(precision);
		p2.setTags(tags);
		p2.setTime(time);

		// WHEN I call equals on one with the other as arg
		boolean equals = p1.equals(p2);

		// THEN equals returns true
		assertThat(equals).isEqualTo(true);
	}

	@Test
	public void testUnEquals() throws Exception {
		// GIVEN two point objects with different data
		Map<String, Object> fields1 = new HashMap<>();
		fields1.put("foo", "bar");

		Map<String, Object> fields2 = new HashMap<>();
		fields2.put("foo", "baz");

		String measurement = "measurement";

		TimeUnit precision = TimeUnit.NANOSECONDS;

		Map<String, String> tags = new HashMap<>();
		tags.put("bar", "baz");

		Long time = System.currentTimeMillis();

		Point p1 = new Point();
		p1.setFields(fields1);
		p1.setMeasurement(measurement);
		p1.setPrecision(precision);
		p1.setTags(tags);
		p1.setTime(time);

		Point p2 = new Point();
		p2.setFields(fields2);
		p2.setMeasurement(measurement);
		p2.setPrecision(precision);
		p2.setTags(tags);
		p2.setTime(time);

		// WHEN I call equals on one with the other as arg
		boolean equals = p1.equals(p2);

		// THEN equals returns true
		assertThat(equals).isEqualTo(false);
	}
}
