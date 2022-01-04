#include <stdint.h>
#include <stdio.h>
#include <fcntl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <sys/mman.h>
#include <inttypes.h>

int main()
{
  printf("%s\n", "Reading!"); // print the statement.

  /* open file */
  int fd = open ("1911.tdf", O_RDONLY);

  /* Get the size of the file. */
  struct stat s;
  int status = fstat (fd, & s);
  int size = s.st_size;
  printf("File size: %d\n", size);

  uint8_t *map = mmap(0, size, PROT_READ, MAP_PRIVATE, fd, 0);
  if (!map) {
    return -1;
  }

  printf("Length: %d\n", (uint8_t)map[24]);
  printf("Name: %s\n", &map[25]);
  printf("Type: %d\n", map[41]);
  uint16_t *characters = (uint16_t*)&map[45];
  //printf("test: %d - %d\n", characters[0], 0xffff);
  // printf("test 1: %d -! %d\n", characters[0], 0xffff);

  printf("hm %d\n\n", 188/2);

  for (int i = 0; i < 188 / 2; i++) {
    printf("[%d]: %d\n", i, characters[i]);
  }

  return 0;
}
